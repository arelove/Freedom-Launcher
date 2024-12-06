

<div align="center"> <img src="/resources/icon.gif" width="250px" height="250px"  loop autoplay/> <h1 align="center">Freedom Launcher</h1> <p align="center"> <strong>A lightweight game launcher with built-in torrent support and customizable UI.</strong> </p> </div>

---

# Freedom Launcher

Freedom Launcher is a convenient and customizable launcher for games and applications, developed using **Tauri**, **React**, and **Rust**.  
The app allows users to efficiently manage games, customize the appearance, modify the interface, and utilize localization features.

---

## 📸 Interface Example

### Main Screen

https://github.com/user-attachments/assets/10cfd89c-5611-4b32-a729-6a8ce008bca2

### Application in Action

https://github.com/user-attachments/assets/0448444b-840b-43cd-97d4-0759228b65e0

---

## 🛠️ Installation

### System Requirements

- **Node.js** (v18 or higher)
- **Rust**
- **Tauri CLI** (install via Cargo)

### Installation Steps

1. Clone the repository:
    
    ```bash
    git clone https://github.com/arelove/Freedom-Launcher.git
    cd Freedom-Launcher
    ```
    
2. Install dependencies:
    
    ```bash
    npm install
    ```
    
3. Ensure Tauri CLI is installed:
    
    ```bash
    cargo install tauri-cli
    ```
    
4. Build the project:
    
    ```bash
    npm run tauri build
    ```
    

---

## 🏃 Running the Application

### Development Mode

1. Run the project with hot-reloading:
    
    ```bash
    npm run tauri dev
    ```
    
2. Open the application window to start using it.
    

### Build Mode

1. Build the project:
    
    ```bash
    npm run tauri build
    ```
    
2. The compiled file will be located in the `src-tauri/target/release` folder.
    
3. Run the compiled file:
    
    ```bash
    ./src-tauri/target/release/FreedomLauncher
    ```
    

---

## 📦 Project Structure

```plaintext
Freedom-Launcher/
├── icons/                    # Files for images, videos, and other 
├── resources/                # GitFiles for MD
├── src/                      # React components
├── src-tauri/                # Tauri and Rust logic
│   ├── src/                  # Rust functions
│   ├── tauri.conf.json       # Tauri configuration
├── package.json              # Node.js project information
├── README.md                 # Documentation
```

---

## 👥 Authors

- **Ar3love** — Development, ideas, and project maintenance.

---

## 📜 License

The project is distributed under the MIT License. See [LICENSE](https://chatgpt.com/c/LICENSE) for details.

---

## 💡 Suggestions for Improvement

If you have ideas or suggestions, feel free to create a new **Issue** in the repository.
