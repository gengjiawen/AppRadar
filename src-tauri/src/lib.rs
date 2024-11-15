use serde::Serialize;
use std::fs;
use std::path::Path;
use tauri::{TitleBarStyle, WebviewUrl, WebviewWindowBuilder};
use plist::Value;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Serialize)]
struct AppInfo {
    name: String,
    path: String,
    framework: String,
}

#[tauri::command]
async fn get_app_frameworks() -> Vec<AppInfo> {
    let mut results = Vec::new();

    // Get applications directory path
    let apps_dir = "/Applications";

    if let Ok(entries) = fs::read_dir(apps_dir) {
        for entry in entries {
            if let Ok(entry) = entry {
                let path = entry.path();
                if path.is_dir() && path.extension().and_then(|s| s.to_str()) == Some("app") {
                    let path_str = path.to_string_lossy().to_string();
                    let plist_path = path.join("Contents/Info.plist");
                    let app_name = if let Ok(plist_content) = fs::read_to_string(&plist_path) {
                        let cursor = std::io::Cursor::new(plist_content);
                        if let Ok(plist) = plist::Value::from_reader(cursor) {
                            if let Some(name) = plist.as_dictionary().and_then(|dict| dict.get("CFBundleName")).and_then(|name| name.as_string()) {
                                name.to_string()
                            } else {
                                path.file_stem().unwrap().to_string_lossy().to_string()
                            }
                        } else {
                            path.file_stem().unwrap().to_string_lossy().to_string()
                        }
                    } else {
                        path.file_stem().unwrap().to_string_lossy().to_string()
                    };
                    let framework_type = detect_framework(&path).await;

                    results.push(AppInfo {
                        name: app_name,
                        path: path_str,
                        framework: framework_type,
                    });
                    results.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));
                } else {
                    println!("Not a directory: {}", path.display());
                }
            }
        }
    }

    results
}

async fn detect_framework(app_path: &Path) -> String {
    let contents_path = app_path.join("Contents");
    let frameworks_path = contents_path.join("Frameworks");
    let macos_path = contents_path.join("MacOS");

    // Check for Electron
    if frameworks_path
        .join("Electron Framework.framework")
        .exists()
    {
        return "electron".to_string();
    }

    // Check for Flutter
    if frameworks_path.join("FlutterMacOS.framework").exists() {
        return "flutter".to_string();
    }

    // Check for Qt
    if frameworks_path.join("QtCore.framework").exists() {
        return "qt".to_string();
    }

    // Check for native Swift/SwiftUI apps by looking for Mach-O binaries in MacOS dir
    if frameworks_path.exists() {
        if let Ok(entries) = fs::read_dir(&macos_path) {
            for entry in entries {
                if let Ok(entry) = entry {
                    let path = entry.path();
                    if path.is_file() {
                        // Use std::process::Command to run 'file' command
                        if let Ok(output) = tokio::process::Command::new("file")
                            .arg(&path)
                            .output()
                            .await 
                        {
                            let output = String::from_utf8_lossy(&output.stdout);
                            if output.contains("Mach-O") {
                                return "native".to_string();
                            }
                        }
                    }
                }
            }
        }
    }

    // Check for Tauri
    if let Ok(entries) = fs::read_dir(&macos_path) {
        for entry in entries {
            if let Ok(entry) = entry {
                let path = entry.path();
                if path.is_file() {
                    if let Ok(content) = tokio::fs::read(&path).await {
                        let content_str = String::from_utf8_lossy(&content);
                        if content_str.contains("__TAURI_") {
                            return "tauri".to_string();
                        }
                    }
                }
            }
        }
    }

    "Unknown".to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .setup(|app| {
            let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
                .title("")
                .inner_size(400.0, 600.0);

            // set transparent title bar only when building for macOS
            #[cfg(target_os = "macos")]
            let win_builder = win_builder.title_bar_style(TitleBarStyle::Transparent);

            let window = win_builder.build().unwrap();

            // set background color only when building for macOS
            #[cfg(target_os = "macos")]
            {
                use cocoa::appkit::{NSColor, NSWindow};
                use cocoa::base::{id, nil};

                let ns_window = window.ns_window().unwrap() as id;
                unsafe {
                    let bg_color = NSColor::colorWithRed_green_blue_alpha_(
                        nil,
                        72.0 / 255.0,
                        36.0 / 255.0,
                        100.0 / 255.0,
                        1.0,
                    );
                    ns_window.setBackgroundColor_(bg_color);
                }
            }

            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, get_app_frameworks])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
