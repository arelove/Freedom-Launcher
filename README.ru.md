

<div align="center">

<img src="/resources/icon.gif " width="250px" height="250px"/>

<h1 align="center">Freedom Launcher</h1> <p align="center"> <strong>Клиент для запуска игр со встроенной поддержкой торрентов и настраиваемым пользовательским интерфейсом.</strong> </p>

</div>

---

# Freedom Launcher

Freedom Launcher — это удобный и кастомизируемый лаунчер для игр и приложений, разработанный с использованием **Tauri**, **React** и **Rust**. Приложение позволяет пользователям эффективно управлять играми, настраивать внешний вид, изменять интерфейс, а также использовать функции локализации.


---

## 📸 Пример интерфейса

### Главный экран

https://github.com/user-attachments/assets/10cfd89c-5611-4b32-a729-6a8ce008bca2

### Видео работы приложения

https://github.com/user-attachments/assets/0448444b-840b-43cd-97d4-0759228b65e0

---

## 🛠️ Установка

### Системные требования

- **Node.js** (v18 или выше)
- **Rust** 
- **Tauri CLI** (установка через Cargo)

### Шаги для установки

1. Клонируйте репозиторий:
    
    ```bash
    git clone https://github.com/arelove/Freedom-Launcher.git
    cd Freedom-Launcher
    ```
    
2. Установите зависимости:
    
    ```bash
    npm install
    ```
    
3. Убедитесь, что у вас установлен Tauri CLI:
    
    ```bash
    cargo install tauri-cli
    ```
    
4. Соберите проект:
    
    ```bash
    npm run tauri build
    ```
    

---

## 🏃 Запуск

### В режиме разработки

1. Запустите проект с горячей перезагрузкой:
    
    ```bash
    npm run tauri dev
    ```
    
2. Откройте окно приложения, чтобы начать использование.
    

### В режиме сборки

1. Соберите проект:
    
    ```bash
    npm run tauri build
    ```
    
2. Скомпилированный файл будет находиться в папке `src-tauri/target/release`.
    
3. Запустите скомпилированный файл:
    
    ```bash
    ./src-tauri/target/release/FreedomLauncher
    ```
    

---

## 📦 Структура проекта

```plaintext
Freedom-Launcher/
├── assets/                   # Файлы для изображений, видео и прочих медиа
├── src/                      # React-компоненты
├── src-tauri/                # Tauri и Rust логика
│   ├── src/                  # Функции на Rust
│   ├── tauri.conf.json       # Конфигурация Tauri
├── package.json              # Информация о Node.js проекте
├── README.md                 # Документация
```

---

## 👥 Авторы

- **Ar3love** — разработка, идеи и поддержка проекта.


---

## 📜 Лицензия

Проект распространяется под лицензией MIT. Ознакомьтесь с [LICENSE](https://chatgpt.com/c/LICENSE) для подробной информации.

---

## 💡 Идеи для улучшения

Если у вас есть идеи или предложения, создайте новый **Issue** в репозитории.
