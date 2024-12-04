use std::collections::HashMap;
use std::fs::{self};
use std::path::{Path};
use walkdir::WalkDir;
use serde::Serialize;
use tauri::command;
use winapi::um::fileapi::GetLogicalDrives;



#[derive(Serialize)]
pub struct AnalysisData {
    pub folder_sizes: Vec<FolderSize>,
    pub file_types: Vec<FileType>,
}


#[derive(Serialize)]
pub struct FolderSize {
    pub name: String,
    pub size: u64,
}

#[derive(Serialize)]
pub struct FileType {
    pub type_: String,
    pub size: u64,
}

#[tauri::command]
pub async fn analyze_disk(disk: String, min_file_size: u64, mut file_types: Vec<String>, min_folder_size: u64) -> Result<AnalysisData, String> {
    let mut folder_sizes = Vec::new();
    let mut file_types_map = HashMap::new();
    let mut total_files = Vec::new();

    // Удаляем пустые строки из фильтра
    file_types.retain(|ext| !ext.trim().is_empty());

    // Логируем входные параметры
    println!("Minimum file size: {}", min_file_size);
    println!("File types filter: {:?}", file_types);
    println!("Minimum folder size: {}", min_folder_size);

    for entry in WalkDir::new(&disk) {
        match entry {
            Ok(entry) => {
                if entry.file_type().is_dir() {
                    match get_folder_size(entry.path(), min_folder_size) {
                        Ok(size) if size > 0 => folder_sizes.push(FolderSize {
                            name: entry.path().display().to_string(),
                            size,
                        }),
                        Err(e) => eprintln!("Error calculating folder size for {}: {}", entry.path().display(), e),
                        _ => {} // Пропускаем папки с размером 0
                    }
                } else {
                    let size = match entry.metadata() {
                        Ok(metadata) => metadata.len(),
                        Err(e) => {
                            eprintln!("Error reading metadata for file {}: {}", entry.path().display(), e);
                            continue;
                        }
                    };

                    // Пропуск файлов, размер которых меньше минимального
                    if size < min_file_size {
                        continue;
                    }

                    let ext = entry.path().extension()
                        .and_then(|s| s.to_str())
                        .unwrap_or("unknown")
                        .to_string();

                    // // Логируем расширение файла
                    // println!("Found file: {} with extension: {}", entry.path().display(), ext);

                    // Если типы файлов указаны пользователем, используем фильтрацию
                    if !file_types.is_empty() {
                        if file_types.contains(&ext) {
                            *file_types_map.entry(ext.clone()).or_insert(0) += size;
                            total_files.push((entry.path().display().to_string(), size));
                        }
                    } else {
                        // Если типы файлов не указаны, добавляем все файлы
                        *file_types_map.entry(ext.clone()).or_insert(0) += size;
                        total_files.push((entry.path().display().to_string(), size));
                    }
                }
            }
            Err(e) => eprintln!("Error reading entry: {}", e),
        }
    }

    let file_types: Vec<FileType> = file_types_map.into_iter()
        .map(|(type_, size)| FileType {
            type_: type_,
            size,
        })
        .collect();

    Ok(AnalysisData {
        folder_sizes,
        file_types,
    })
}





#[command]
pub fn get_folder_size(path: &Path, min_folder_size: u64) -> Result<u64, String> {
    let mut folder_size = 0;
    let mut stack = vec![path.to_path_buf()]; // Используем стек для обхода

    while let Some(current_path) = stack.pop() {
        match fs::read_dir(&current_path) {
            Ok(entries) => {
                for entry in entries {
                    match entry {
                        Ok(entry) => {
                            let metadata = match entry.metadata() {
                                Ok(metadata) => metadata,
                                Err(e) => {
                                    eprintln!("Error reading metadata for {}: {}", entry.path().display(), e);
                                    continue;
                                }
                            };
                            if metadata.is_dir() {
                                stack.push(entry.path()); // Добавляем директории в стек
                            } else {
                                folder_size += metadata.len();
                            }
                        }
                        Err(e) => eprintln!("Error reading entry {}: {}", current_path.display(), e),
                    }
                }
            }
            Err(e) => eprintln!("Error reading directory {}: {}", current_path.display(), e),
        }
    }

    // Учитываем размер папки только если он больше минимального размера
    if folder_size >= min_folder_size {
        Ok(folder_size)
    } else {
        Ok(0) // Возвращаем 0, если размер папки меньше минимального
    }
}



#[command]
pub fn list_disks() -> Result<Vec<String>, String> {
    let mask = unsafe { GetLogicalDrives() };
    let mut drives = Vec::new();

    for i in 0..26 {
        let bit = 1 << i;
        if mask & bit != 0 {
            let drive = format!("{}:", ('A' as u8 + i) as char);
            drives.push(drive);
        }
    }

    Ok(drives)
}