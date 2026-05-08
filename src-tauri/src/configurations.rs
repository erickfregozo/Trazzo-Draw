use std::fs;
use std::path::Path;
use tauri::{AppHandle, Manager, Runtime};

#[tauri::command]
pub async fn init_config<R: Runtime>(app: AppHandle<R>) -> Result<String, String> {
    let app_config_dir = app
        .path()
        .app_config_dir()
        .map_err(|e| format!("Failed to get app config directory: {}", e))?;

    if !app_config_dir.exists() {
        fs::create_dir_all(&app_config_dir)
            .map_err(|e| format!("Failed to create config directory: {}", e))?;
    }

    let config_resource_dir = app
        .path()
        .resolve("public/", tauri::path::BaseDirectory::Resource)
        .map_err(|e| format!("Failed to resolve config directory: {}", e))?;

    if config_resource_dir.exists() {
        copy_missing_files(&config_resource_dir, &app_config_dir)?;
    }

    Ok("Finalizo".to_string())
}

#[tauri::command]
pub async fn read_config<R: Runtime>(app: AppHandle<R>, config: String) -> Result<String, String> {
    let app_config_dir = app
        .path()
        .app_config_dir()
        .map_err(|e| format!("Failed to get app config directory: {}", e))?;

    let config_file_path = app_config_dir.join("config").join(config + ".ini");
    let config_file_content = fs::read_to_string(&config_file_path)
        .map_err(|e| format!("Failed to read config file: {}", e))?;

    Ok(config_file_content)
}

#[tauri::command]
pub fn list_configurations<R: Runtime>(_app: AppHandle<R>) -> Result<Vec<String>, String> {
    let app_config_dir = _app
        .path()
        .app_config_dir()
        .map_err(|e| format!("Failed to get app config directory: {}", e))?;

    let config_dir = app_config_dir.join("config");
    let mut configurations = Vec::new();

    if config_dir.exists() {
        for entry in fs::read_dir(config_dir).map_err(|e| format!("Failed to read config directory: {}", e))? {
            let entry = entry.map_err(|e| format!("Failed to read directory entry: {}", e))?;
            let path = entry.path();
            if path.is_file() {
                if let Some(file_name) = path.file_name() {
                    if let Some(file_name_str) = file_name.to_str() {
                        if file_name_str.ends_with(".ini") {
                            configurations.push(file_name_str.to_string());
                        }
                    }
                }
            }
        }
    }

    Ok(configurations)
}

// --- Funciones auxiliares (se mantienen igual) ---
fn copy_missing_files(source: &Path, destination: &Path) -> Result<(), String> {
    for entry in fs::read_dir(source).map_err(|e| format!("Failed to read source directory: {}", e))? {
        let entry = entry.map_err(|e| format!("Failed to read directory entry: {}", e))?;
        let source_path = entry.path();
        let file_name = entry.file_name();
        let dest_path = destination.join(&file_name);

        if source_path.is_dir() {
            if !dest_path.exists() {
                let _ = fs::create_dir_all(&dest_path);
            }
            copy_missing_files(&source_path, &dest_path)?;
        } else if source_path.is_file() {
            let file_name_str = file_name.to_string_lossy();
            if !is_in_specific_folder(&source_path) || !file_already_exists_in_subfolder(&destination, &file_name_str) {
                if !dest_path.exists() {
                    let _ = fs::copy(&source_path, &dest_path);
                }
            }
        }
    }
    Ok(())
}

fn is_in_specific_folder(source_path: &Path) -> bool {
    source_path.components().count() > 2
}

fn file_already_exists_in_subfolder(destination: &Path, file_name: &str) -> bool {
    if let Ok(entries) = fs::read_dir(destination) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                let file_in_subfolder = path.join(file_name);
                if file_in_subfolder.exists() {
                    return true;
                }
            }
        }
    }
    false
}

