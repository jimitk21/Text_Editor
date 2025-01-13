Shareable Notes Application

This project is a user-friendly notes application that allows users to create, edit, delete, and format notes using a custom-built rich text editor. It also includes AI-powered auto glossary highlighting, which provides definitions for key terms.

Installation

Step 1: Set up the Backend (Flask + Groq)

Install the necessary Python packages:

pip install flask
pip install groq

Run the Flask backend:

python main.py

Step 2: Set up the Frontend

How to Use

Open the application in your browser (likely at http://localhost:3000).

Create, edit, and manage notes by using the custom rich text editor. You can:
        Apply text formatting like bold, italic, underline, and alignment.
        Set font size and change font family.

Pin important notes to keep them at the top of your notes list by clicking the pin icon.

Use the AI-powered glossary highlighting by writing notes that include key terms such as "AI", "machine learning", "deep learning". Hover over these terms to see a popup with definitions.

Features

    Custom Rich Text Editor: Supports bold, italic, underline, alignment, and font size adjustments.
    Note Management: Add, edit, delete, and pin notes for easy access.
    Auto Glossary Highlighting: Highlights key terms and displays definitions using Groq's API.