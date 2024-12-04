use std::process::Command;
use tauri::command;

#[command]
pub async fn python_script(path: String, time_window: u64, depth: u32, pathtofileanalyze: String) -> Result<(), String> {
    // Запускаем команду в асинхронном режиме
    let output = Command::new("NodeScript/build/exe.win-amd64-3.10/diks.exe")
        .arg(path)
        .arg(time_window.to_string())
        .arg(depth.to_string())
        .arg(pathtofileanalyze)
        .output()
        .map_err(|e| format!("Ошибка запуска EXE файла: {}", e))?;

    if output.status.success() {
        Ok(())
    } else {
        Err(format!(
            "EXE файл завершился с ошибкой: {}",
            String::from_utf8_lossy(&output.stderr)
        ))
    }
}

