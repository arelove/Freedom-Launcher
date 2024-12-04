#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

extern crate winapi;
mod disks;
mod python_anal;
mod torrent_parse;
// mod torrent_download;

use std::process::Command;
use sysinfo::{
    Components, 
    Disks, 
    Networks, 
    System, };

use tauri::Manager;
use std::thread;
use std::time::Duration;
use tauri::PhysicalPosition;
use tauri::PhysicalSize;

use serde::{Deserialize, Serialize};
use std::path::Path;
use lmdb::{DatabaseFlags, Environment, Transaction, Database};
use std::fs;    
    
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![

            minimize_window,
            toggle_maximize,
            close_window,
            start_dragging,
            reload_window,
            toggle_fullscreen,
            
            save_shortcuts, 
            load_shortcuts, 
            get_icon_path,
            get_system_info,
            run_app,
            resize_window,
            set_always_on_top,

            disks::analyze_disk,
            disks::list_disks,

            python_anal::python_script,

            torrent_parse::download_torrent,
            torrent_parse::fetch_games_data,
            torrent_parse::fetch_game_detail,

            // torrent_download::get_torrent,

            // parse_img::fetch_images,


        ])
        .setup(|app| {
            let splashscreen_window = app.get_window("splashcreen").unwrap();
            let main_window = app.get_window("main").unwrap();

            let monitors = main_window.available_monitors().unwrap();
            let screen_size = monitors[0].size();
            let splash_size = PhysicalSize::new(800, 600);
            let main_size = PhysicalSize::new(1400, 700);

            let splash_x = (screen_size.width as f64 - splash_size.width as f64) / 2.0;
            let splash_y = (screen_size.height as f64 - splash_size.height as f64) / 2.0;
            splashscreen_window.set_position(PhysicalPosition::new(splash_x as i32, splash_y as i32)).unwrap();

            let main_x = (screen_size.width as f64 - main_size.width as f64) / 2.0;
            let main_y = (screen_size.height as f64 - main_size.height as f64) / 2.0;

            main_window.set_position(PhysicalPosition::new(main_x as i32, main_y as i32)).unwrap();

            tauri::async_runtime::spawn(async move {
                thread::sleep(Duration::from_secs(3));
                splashscreen_window.close().unwrap();
                main_window.show().unwrap();
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    }

#[tauri::command]
fn set_always_on_top(window: tauri::Window, always_on_top: bool) -> Result<(), String> {
    window.set_always_on_top(always_on_top)
        .map_err(|err| format!("Failed to set window on top: {}", err))
}
    
#[tauri::command]
fn resize_window(window: tauri::Window, width: u32, height: u32) {
    window.set_size(tauri::PhysicalSize::new(width, height)).unwrap();
}
    

#[tauri::command]
fn minimize_window(window: tauri::Window) {
    window.minimize().unwrap();
}

#[tauri::command]
fn toggle_maximize(window: tauri::Window) {
    if window.is_maximized().unwrap() {
        window.unmaximize().unwrap();
    } else {
        window.maximize().unwrap();
    }
}

#[tauri::command]
fn close_window(window: tauri::Window) {
    window.close().unwrap();
}

#[tauri::command]
fn start_dragging(window: tauri::Window) {
    window.start_dragging().unwrap();
}
    
#[tauri::command]
fn reload_window(window: tauri::Window) {
  window.eval("window.location.reload();").unwrap();
}

#[tauri::command]
fn toggle_fullscreen(window: tauri::Window) {
  if window.is_fullscreen().unwrap() {
    window.set_fullscreen(false).unwrap();
  } else {
    window.set_fullscreen(true).unwrap();
  }
}


#[derive(Serialize, Deserialize)]
pub struct AppShortcut {
    id: String,
    name: String,
    path: String,
    icon: Option<String>,
    background: Option<String>,
}

#[tauri::command]
// Функция для открытия базы данных
fn open_db() -> Result<(Environment, Database), String> {

    // Создаем директорию для базы данных, если она не существует
    fs::create_dir_all("shortcuts_db").map_err(|e| e.to_string())?;

    // Открываем среду LMDB с увеличенным размером карты
    let env = Environment::new()
        .set_max_dbs(1)
        .set_map_size(500 * 1024 * 1024) // 0.5 ГБ
        .open(Path::new("shortcuts_db"))
        .map_err(|e| e.to_string())?;

    // Создаем базу данных, если она не существует
    let db = env.create_db(Some("shortcuts"), DatabaseFlags::empty())
        .map_err(|e| e.to_string())?;
    Ok((env, db))
}

#[tauri::command]
fn save_shortcuts(shortcuts: Vec<AppShortcut>) -> Result<(), String> {
    let (env, db) = open_db()?;

    let mut txn = env.begin_rw_txn().map_err(|e| e.to_string())?;
    let serialized = serde_json::to_vec(&shortcuts).map_err(|e| e.to_string())?;
    txn.put(db, b"shortcuts", &serialized, lmdb::WriteFlags::empty())
        .map_err(|e| e.to_string())?;

    txn.commit().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn load_shortcuts() -> Result<Vec<AppShortcut>, String> {
    let (env, db) = open_db()?;

    let txn = env.begin_ro_txn().map_err(|e| e.to_string())?;
    let data = txn.get(db, b"shortcuts").map_err(|e| e.to_string())?;
    let shortcuts: Vec<AppShortcut> = serde_json::from_slice(data).map_err(|e| e.to_string())?;
    Ok(shortcuts)
}


#[tauri::command]
fn get_icon_path(path: String) -> Result<String, String> {
  let exe_path = std::path::Path::new(&path);
  let exe_name = exe_path.file_name().and_then(std::ffi::OsStr::to_str).ok_or("Invalid exe path")?;
  let icon_path = extract_icon(&path).unwrap_or_else(|_| format!("icons/{}.png", exe_name)); // Предполагаем, что иконки хранятся в icons/ с именем exe
  Ok(icon_path)
}

fn extract_icon(path: &str) -> Result<String, String> {
  let output = std::process::Command::new("extract-icon")
      .arg(path)
      .output()
      .map_err(|e| e.to_string())?;

  if output.status.success() {
      let icon_path = String::from_utf8_lossy(&output.stdout).trim().to_string();
      Ok(icon_path)
  } else {
      Err(String::from_utf8_lossy(&output.stderr).into_owned())
  }
}

#[tauri::command]
fn get_system_info() -> SystemInfo {
    // Создаем объект системы и обновляем все данные
    let mut sys = System::new_all();
    sys.refresh_all();

    // Собираем информацию о системе
    let cpu_count = sys.cpus().len();
    let swap_info = format!(
        "Общий объем swap: {} МБ, Используемый swap: {} МБ",
        sys.total_swap()/(1024*1024),
        sys.used_swap()/(1024*1024)
    );

    let memory_info_total = sys.total_memory()/(1024*1024);
    let memory_info_usage = sys.used_memory()/(1024*1024);


    let system_name = System::name().unwrap_or_default();
    let kernel_version = System::kernel_version().unwrap_or_default();
    let os_version = System::os_version().unwrap_or_default();
    let host_name = System::host_name().unwrap_or_default();

    let process_info: Vec<String> = sys.processes().iter()
        .map(|(pid, process)| format!(
            "[{}] {} {:?}", pid, process.name(), process.disk_usage()
        ))
        .collect();

    let disk_info: Vec<String> = Disks::new_with_refreshed_list().iter()
        .map(|disk| format!("{:?}", disk))
        .collect();

    let network_info: Vec<String> = Networks::new_with_refreshed_list().iter()
        .map(|(interface_name, data)| format!(
            "{}: {} байт (входящие) / {} байт (исходящие)",
            interface_name,
            data.total_received(),
            data.total_transmitted()
        ))
        .collect();

    let component_info: Vec<String> = Components::new_with_refreshed_list().iter()
        .map(|component| format!("{:?}", component))
        .collect();

    SystemInfo {
        cpu_count,
        memory_info: memory_info_total,
        memory_usage: memory_info_usage,
        swap: swap_info,
        system_name,
        kernel_version,
        os_version,
        host_name,
        processes: process_info.join(", "),
        disks: disk_info.join(", "),
        networks: network_info.join(", "),
        components: component_info.join(", "),
    }
}

#[derive(Serialize)]
struct SystemInfo {
    cpu_count: usize,
    memory_info: u64,
    memory_usage: u64,
    swap: String,
    system_name: String,
    kernel_version: String,
    os_version: String,
    host_name: String,
    processes: String,
    disks: String,
    networks: String,
    components: String,
}


#[tauri::command]
fn run_app(path: String) -> Result<(), String> {
    std::thread::spawn(move || {
        if let Err(e) = Command::new(&path).spawn() {
            eprintln!("Failed to start application: {}", e);
        }
    });
    Ok(())
}

