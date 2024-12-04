use reqwest::Client;
use std::fs::File;
use std::io::copy;
use std::path::{Path, PathBuf};
use scraper::{Html, Selector};
use reqwest;
use std::collections::HashMap;
use regex::Regex; // Добавим для замены запрещенных символов
use std::fs;    

#[tauri::command]
pub async fn fetch_game_detail(url: String) -> Result<String, String> {
    let response = reqwest::get(&url).await.map_err(|e| e.to_string())?;
    let body = response.text().await.map_err(|e| e.to_string())?;
    let document = Html::parse_document(&body);
    let title_selector = Selector::parse("header.full-title").unwrap();
    let description_selector = Selector::parse("div.mov-desc-text").unwrap();
    let image_selector = Selector::parse("div.mov-img img").unwrap();
    let details_selector = Selector::parse("div.col-mov-right").unwrap();

    let mut game_data: HashMap<String, String> = HashMap::new();
    let title = document
        .select(&title_selector)
        .next()
        .map(|element| {
            let text_title = element.text().collect::<Vec<_>>().concat();
            text_title.split("скачать торрент")
                .next()
                .unwrap_or(&text_title)
                .trim()
                .to_string()
        })
        .unwrap_or_else(|| "Без названия".into());
    game_data.insert("title".into(), title);
    let description = document
        .select(&description_selector)
        .next()
        .map(|element| {
            let text = element.text().collect::<Vec<_>>().concat();

            text.split("На этой странице по кнопке ниже вы можете скачать")
                .next()
                .unwrap_or(&text)
                .trim()
                .to_string()
        })
        .unwrap_or_else(|| "Нет описания".into());
    game_data.insert("description".into(), description);
    let image = document
        .select(&image_selector)
        .next()
        .map(|element| element.value().attr("src").unwrap_or("").to_string())
        .unwrap_or_else(|| "".into());
    game_data.insert("image".into(), image);
    let mut details: HashMap<String, String> = HashMap::new();
    if let Some(container) = document.select(&details_selector).next() {
        for li in container.select(&Selector::parse("li").unwrap()) {
            if let (Some(label), Some(desc)) = (
                li.select(&Selector::parse("div.mov-label").unwrap()).next(),
                li.select(&Selector::parse("div.mov-desc").unwrap()).next()
            ) {
                let label_text = label.text().collect::<Vec<_>>().concat().trim().to_string();
                let desc_text = desc.text().collect::<Vec<_>>().concat().trim().to_string();
                details.insert(label_text, desc_text);
            }
        }
    }
    game_data.insert("details".into(), serde_json::to_string(&details).unwrap());
    let mut system_requirements = String::new();
    if let Some(container) = document.select(&details_selector).next() {
        let mut is_system_requirements = false;
        for text_node in container.text() {
            if text_node.trim() == "Системные требования" {
                is_system_requirements = true;
                continue;
            }
            if is_system_requirements {
                if text_node.contains(':') {
                    system_requirements.push_str(text_node.trim());
                    system_requirements.push('\n');
                }
            }
        }
    }
    game_data.insert("system_requirements".into(), system_requirements.trim_end().to_string());
    let game_data_json = serde_json::json!(game_data);
    Ok(game_data_json.to_string())
}

// Функция для замены запрещенных символов на кириллицу или подчеркивания
fn sanitize_filename(filename: &str) -> String {
    let re = Regex::new(r"[^a-zA-Z0-9а-яА-ЯёЁ ._-]").unwrap();
    re.replace_all(filename, "_").to_string()
}

fn get_filename_from_title(title: &str) -> String {
    sanitize_filename(title)
}

fn get_unique_file_path(dir: &Path, base_name: &str, ext: &str) -> PathBuf {
    let mut counter = 1;
    let mut file_path = dir.join(format!("{}{}.{}", base_name, "", ext));

    while file_path.exists() {
        file_path = dir.join(format!("{}_{:03}.{}", base_name, counter, ext));
        counter += 1;
    }

    file_path
}

#[tauri::command]
pub async fn download_torrent(url: String) -> Result<(), String> {
    let client = Client::new();

    // Получаем HTML-страницу
    let response = client.get(&url).send().await.map_err(|e| e.to_string())?;
    
    if !response.status().is_success() {
        return Err("Ошибка при загрузке страницы".into());
    }
    
    let html = response.text().await.map_err(|e| e.to_string())?;
    
    // Извлечение URL для торрент-файла
    let torrent_url = extract_torrent_url(&html)?;

    // Загружаем торрент-файл
    let torrent_response = client.get(&torrent_url).send().await.map_err(|e| e.to_string())?;
    
    if !torrent_response.status().is_success() {
        return Err("Ошибка при загрузке торрент-файла".into());
    }

    let content = torrent_response.bytes().await.map_err(|e| e.to_string())?;

    // Проверяем размер файла
    if content.len() == 0 {
        return Err("Торрент-файл пуст".into());
    }

    // Получаем название игры из HTML
    let document = Html::parse_document(&html);
    let title_selector = Selector::parse("header.full-title").unwrap();
    let title = document
        .select(&title_selector)
        .next()
        .map(|element| {
            let text_title = element.text().collect::<Vec<_>>().concat();
            text_title.split("скачать торрент")
                .next()
                .unwrap_or(&text_title)
                .trim()
                .to_string()
        })
        .unwrap_or_else(|| "Без названия".into());

    // Используем имя из заголовка для имени файла
    let file_name = get_filename_from_title(&title);
    let unique_file_name = format!("Freedom {}", file_name);
    fs::create_dir_all("Torrents").map_err(|e| e.to_string())?;
    let dir = Path::new("Torrents"); 
    let file_path = get_unique_file_path(dir, &unique_file_name, "torrent");
    
    let mut file = File::create(&file_path).map_err(|e| e.to_string())?;
    
    copy(&mut content.as_ref(), &mut file).map_err(|e| e.to_string())?;
    
    Ok(())
}

fn extract_torrent_url(html: &str) -> Result<String, String> {
    let document = Html::parse_document(html);
    let selector = Selector::parse(".dle_b_torrent_dw .torrent_dw").map_err(|e| e.to_string())?;
    let torrent_url = document.select(&selector)
        .next()
        .and_then(|e| e.value().attr("href"))
        .ok_or("Не удалось найти ссылку на торрент")?;
    Ok(torrent_url.to_string())
}


#[tauri::command]
pub async fn fetch_games_data(url: String) -> Result<String, String> {
    let client = reqwest::Client::new();
    let response = client.get(&url).send().await.map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Err("Ошибка при загрузке данных".into());
    }

    let body = response.text().await.map_err(|e| e.to_string())?;
    Ok(body)
}
