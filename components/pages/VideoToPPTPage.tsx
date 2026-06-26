"use client";

import { useState } from "react";
import { CheckCircle2, FileText, Link as LinkIcon, Mic, Settings, Sparkles, Video, Youtube } from "lucide-react";
import toast from "react-hot-toast";

import { HearderModel } from "@/app/dashboard/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, getResponseData } from "@/lib/api";
import { formatDuration } from "@/lib/utils";
import { cloudinaryVideoToAudio } from "@/lib/video-processing";
import DashboardHeader from "../DashboardHeader";
import FileUploader from "../FileUpload";
import ProgressTracker from "../Progress";
import VideoPlayer from "../VideoPlayer";
import VideoPreviewPage from "./VideoPreviewPage";

interface Props {
	Header: HearderModel;
}

const LoadingSteps = [
	"Loading video",
	"Extracting YouTube video",
	"Summerizing video",
	"Uploading to Cloud",
	"All Most Done...",
];

const temp =
	"[\n  {\n    \"slideIndex\": 1,\n    \"title\": \"Willkommen zu JavaScript\",\n    \"htmlContent\": \"<div style='background: linear-gradient(135deg, #1A202C 0%, #2D3748 100%); font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #E2E8F0; text-align: center; overflow: hidden;'><style>@keyframes fadeInScale { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } } @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }</style><svg width='10vw' height='10vw' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1' stroke-linecap='round' stroke-linejoin='round' class='feather feather-code' style='animation: fadeInScale 0.8s ease-out forwards; margin-bottom: 2vw; filter: drop-shadow(0 0 1vw #63B3ED);'><polyline points='16 18 22 12 16 6'></polyline><polyline points='8 6 2 12 8 18'></polyline></svg><h1 style='font-size: 4vw; margin-bottom: 1vw; animation: slideUp 0.8s ease-out forwards;'>JavaScript für Einsteiger</h1><p style='font-size: 1.5vw; animation: slideUp 1s ease-out forwards;'>Dynamische und interaktive Websites erstellen</p></div>\",\n    \"detailedNotes\": \"Diese einführende Folie stellt JavaScript als eine Programmiersprache vor, die zur Erstellung dynamischer und interaktiver Websites verwendet wird. Sie hebt hervor, dass JavaScript in jedem modernen Webbrowser läuft, wie Google Chrome, Safari oder Edge, und ermöglicht die Interaktion des Benutzers mit der Website. Die Folie dient als Begrüßung zum Thema und setzt den Rahmen für die bevorstehenden Lektionen, wobei die Notwendigkeit grundlegender HTML- und CSS-Kenntnisse vor dem Start betont wird.\",\n    \"speakerNotes\": \"Herzlich willkommen zu unserem heutigen Deep Dive in JavaScript! Wenn Sie schon immer wissen wollten, wie Webseiten zum Leben erwachen, dann sind Sie hier genau richtig. JavaScript ist die Sprache des Webs, die uns ermöglicht, aus statischen HTML- und CSS-Seiten interaktive Erlebnisse zu schaffen. Wir werden in diesem Video die absoluten Grundlagen lernen, die Sie für den Einstieg benötigen.\"\n  },\n  {\n    \"slideIndex\": 2,\n    \"title\": \"Die Macht von JavaScript\",\n    \"htmlContent\": \"<div style='background-color: #1A202C; font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #E2E8F0; padding: 5vw;'><style>@keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }</style><h2 style='font-size: 3vw; margin-bottom: 3vw; text-align: center; color: #63B3ED; animation: fadeIn 0.8s ease-out forwards;'>Was JavaScript alles kann</h2><ul style='list-style: none; padding: 0; width: 80%;'><li style='display: flex; align-items: center; margin-bottom: 2vw; animation: slideInLeft 0.8s ease-out forwards;'><svg width='2vw' height='2vw' viewBox='0 0 24 24' fill='none' stroke='#48BB78' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-check-circle' style='margin-right: 1.5vw; flex-shrink: 0;'><path d='M22 11.08V12a10 10 0 1 1-5.93-8.81'></path><polyline points='22 4 12 14.01 9 11.01'></polyline></svg><p style='font-size: 1.8vw; margin: 0;'>Benutzerinteraktionen verarbeiten</p></li><li style='display: flex; align-items: center; margin-bottom: 2vw; animation: slideInLeft 1s ease-out forwards;'><svg width='2vw' height='2vw' viewBox='0 0 24 24' fill='none' stroke='#48BB78' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-check-circle' style='margin-right: 1.5vw; flex-shrink: 0;'><path d='M22 11.08V12a10 10 0 1 1-5.93-8.81'></path><polyline points='22 4 12 14.01 9 11.01'></polyline></svg><p style='font-size: 1.8vw; margin: 0;'>Dynamische Inhalte auf Webseiten aktualisieren</p></li><li style='display: flex; align-items: center; margin-bottom: 2vw; animation: slideInLeft 1.2s ease-out forwards;'><svg width='2vw' height='2vw' viewBox='0 0 24 24' fill='none' stroke='#48BB78' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-check-circle' style='margin-right: 1.5vw; flex-shrink: 0;'><path d='M22 11.08V12a10 10 0 1 1-5.93-8.81'></path><polyline points='22 4 12 14.01 9 11.01'></polyline></svg><p style='font-size: 1.8vw; margin: 0;'>Komplexe Operationen wie einen 'Taschenrechner' ausführen</p></li><li style='display: flex; align-items: center; animation: slideInLeft 1.4s ease-out forwards;'><svg width='2vw' height='2vw' viewBox='0 0 24 24' fill='none' stroke='#48BB78' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-check-circle' style='margin-right: 1.5vw; flex-shrink: 0;'><path d='M22 11.08V12a10 10 0 1 1-5.93-8.81'></path><polyline points='22 4 12 14.01 9 11.01'></polyline></svg><p style='font-size: 1.8vw; margin: 0;'>Die Benutzeroberfläche basierend auf Nutzereingaben ändern</p></li></ul></div>\",\n    \"detailedNotes\": \"Diese Folie beleuchtet die Kernfähigkeiten von JavaScript und seine Rolle bei der Schaffung interaktiver Benutzererlebnisse. Es wird erklärt, dass JavaScript es ermöglicht, auf Benutzeraktionen zu reagieren, dynamische Inhalte auf Webseiten zu ändern und komplexe Funktionen zu implementieren, wie das Beispiel eines Taschenrechners zeigt. Die Funktionalität geht über das reine Styling (CSS) hinaus und ermöglicht tatsächliche Aktionen und Datenverarbeitung auf der Client-Seite.\",\n    \"speakerNotes\": \"JavaScript ist weit mehr als nur eine Sprache; es ist der Motor für Interaktivität im Web. Es erlaubt uns, auf jede Aktion eines Benutzers zu reagieren – sei es ein Klick, eine Tastatureingabe oder das Bewegen der Maus. Wir können damit dynamisch Inhalte ändern, Formulare validieren oder sogar komplexe Anwendungen wie einen Taschenrechner direkt im Browser ausführen. Es ist die Sprache, die Ihre Webseite zum Leben erweckt.\"\n  },\n  {\n    \"slideIndex\": 3,\n    \"title\": \"Dein Erstes JavaScript-Projekt: Einrichtung\",\n    \"htmlContent\": \"<div style='background: #0D1117; font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #E2E8F0; padding: 5vw;'><style>@keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } } @keyframes fadeInDelayed { from { opacity: 0; } to { opacity: 1; } }</style><h2 style='font-size: 3vw; margin-bottom: 3vw; text-align: center; color: #63B3ED; animation: fadeInDelayed 0.5s ease-out forwards;'>Projekt-Setup in 4 Schritten</h2><div style='display: grid; grid-template-columns: 1fr; gap: 2.5vw; width: 70%;'><div style='display: flex; align-items: center; background-color: #2D3748; padding: 2vw; border-radius: 1vw; box-shadow: 0 0.5vw 1.5vw rgba(0,0,0,0.3); animation: slideInRight 0.6s ease-out forwards;'><span style='font-size: 2.5vw; font-weight: bold; color: #9F7AEA; margin-right: 2vw; flex-shrink: 0;'>1.</span><p style='font-size: 1.6vw; margin: 0;'>Texteditor verwenden (VS Code empfohlen)</p></div><div style='display: flex; align-items: center; background-color: #2D3748; padding: 2vw; border-radius: 1vw; box-shadow: 0 0.5vw 1.5vw rgba(0,0,0,0.3); animation: slideInRight 0.8s ease-out forwards;'><span style='font-size: 2.5vw; font-weight: bold; color: #9F7AEA; margin-right: 2vw; flex-shrink: 0;'>2.</span><p style='font-size: 1.6vw; margin: 0;'>Neuen Projektordner erstellen</p></div><div style='display: flex; align-items: center; background-color: #2D3748; padding: 2vw; border-radius: 1vw; box-shadow: 0 0.5vw 1.5vw rgba(0,0,0,0.3); animation: slideInRight 1s ease-out forwards;'><span style='font-size: 2.5vw; font-weight: bold; color: #9F7AEA; margin-right: 2vw; flex-shrink: 0;'>3.</span><p style='font-size: 1.6vw; margin: 0;'>HTML-, CSS- und JS-Dateien anlegen (index.html, style.css, index.js)</p></div><div style='display: flex; align-items: center; background-color: #2D3748; padding: 2vw; border-radius: 1vw; box-shadow: 0 0.5vw 1.5vw rgba(0,0,0,0.3); animation: slideInRight 1.2s ease-out forwards;'><span style='font-size: 2.5vw; font-weight: bold; color: #9F7AEA; margin-right: 2vw; flex-shrink: 0;'>4.</span><p style='font-size: 1.6vw; margin: 0;'>Dateien miteinander verknüpfen</p></div></div></div>\",\n    \"detailedNotes\": \"Diese Folie führt durch die grundlegenden Schritte zur Einrichtung eines neuen JavaScript-Projekts. Der erste Schritt ist die Auswahl eines geeigneten Texteditors, wobei Visual Studio Code (VS Code) aufgrund seiner umfangreichen Funktionen und Erweiterungen dringend empfohlen wird. Danach wird erklärt, wie man einen neuen Projektordner erstellt und die drei Kernkomponenten einer Webanwendung anlegt: 'index.html' für die Struktur, 'style.css' für das Design und 'index.js' für die Interaktivität. Der letzte und entscheidende Schritt ist das korrekte Verknüpfen dieser Dateien untereinander, um sicherzustellen, dass sie zusammenarbeiten.\",\n    \"speakerNotes\": \"Bevor wir mit dem eigentlichen Codieren beginnen, müssen wir unsere Arbeitsumgebung einrichten. Ich empfehle Ihnen dringend, Visual Studio Code zu verwenden – es ist ein großartiger und kostenloser Editor. Der Prozess ist recht einfach: Erstellen Sie einen neuen Ordner für Ihr Projekt. Darin legen Sie drei Dateien an: eine HTML-Datei für die Struktur, eine CSS-Datei für das Styling und unsere JavaScript-Datei. Der letzte und wichtigste Schritt ist, diese Dateien miteinander zu verknüpfen, damit der Browser sie finden und nutzen kann.\"\n  },\n  {\n    \"slideIndex\": 4,\n    \"title\": \"Integration: HTML, CSS & JavaScript\",\n    \"htmlContent\": \"<div style='background: linear-gradient(to right, #000428, #004e92); font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #E2E8F0; padding: 5vw;'><style>@keyframes blurIn { from { opacity: 0; filter: blur(5px); } to { opacity: 1; filter: blur(0); } } @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }</style><h2 style='font-size: 3vw; margin-bottom: 3vw; text-align: center; color: #63B3ED; animation: blurIn 0.8s ease-out forwards;'>Dateien verknüpfen & Live Server</h2><div style='display: flex; justify-content: space-around; width: 90%; gap: 3vw;'><div style='flex: 1; background-color: rgba(45, 55, 72, 0.7); padding: 2.5vw; border-radius: 1.5vw; box-shadow: 0 0.8vw 2.5vw rgba(0,0,0,0.4); animation: slideInUp 1s ease-out forwards;'><h3 style='font-size: 2.2vw; color: #9F7AEA; margin-bottom: 1.5vw;'>CSS einbinden</h3><svg width='3vw' height='3vw' viewBox='0 0 24 24' fill='none' stroke='#A78BFA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-link' style='margin-bottom: 1vw;'><path d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07L9.5 5.5.5 14.5A5 5 0 0 0 7.5 21l.5.5'></path></svg><p style='font-size: 1.5vw; margin-bottom: 1vw;'>Mit dem <code>&lt;link&gt;</code>-Tag im <code>&lt;head&gt;</code>-Bereich der HTML-Datei:</p><pre style='background-color: #1A202C; color: #E2E8F0; padding: 1.5vw; border-radius: 0.8vw; font-size: 1.2vw; overflow-x: auto;'><code>&lt;link rel=\\\"stylesheet\\\" href=\\\"style.css\\\"&gt;</code></pre></div><div style='flex: 1; background-color: rgba(45, 55, 72, 0.7); padding: 2.5vw; border-radius: 1.5vw; box-shadow: 0 0.8vw 2.5vw rgba(0,0,0,0.4); animation: slideInUp 1.2s ease-out forwards;'><h3 style='font-size: 2.2vw; color: #9F7AEA; margin-bottom: 1.5vw;'>JavaScript einbinden</h3><svg width='3vw' height='3vw' viewBox='0 0 24 24' fill='none' stroke='#A78BFA' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-code' style='margin-bottom: 1vw;'><polyline points='16 18 22 12 16 6'></polyline><polyline points='8 6 2 12 8 18'></polyline></svg><p style='font-size: 1.5vw; margin-bottom: 1vw;'>Mit dem <code>&lt;script&gt;</code>-Tag vor dem schließenden <code>&lt;/body&gt;</code>-Tag:</p><pre style='background-color: #1A202C; color: #E2E8F0; padding: 1.5vw; border-radius: 0.8vw; font-size: 1.2vw; overflow-x: auto;'><code>&lt;script src=\\\"index.js\\\"&gt;&lt;/script&gt;</code></pre><p style='font-size: 1.3vw; margin-top: 1.5vw; color: #CBD5E0;'><em>Tipp: 'Live Server' VS Code-Erweiterung nutzen.</em></p></div></div></div>\",\n    \"detailedNotes\": \"Diese Folie erklärt, wie CSS- und JavaScript-Dateien in eine HTML-Datei eingebunden werden. Für CSS wird das `<link>`-Tag im `<head>`-Bereich verwendet, wobei `rel=\\\"stylesheet\\\"` und `href=\\\"style.css\\\"` die Verbindung herstellen. Für JavaScript wird das `<script>`-Tag genutzt. Es wird ausdrücklich darauf hingewiesen, das JavaScript-Skript-Element am Ende des `<body>`-Abschnitts zu platzieren, um sicherzustellen, dass alle HTML-Elemente geladen und gerendert sind, bevor der JavaScript-Code ausgeführt wird. Abschließend wird die 'Live Server'-Erweiterung für VS Code erwähnt, die eine automatische Aktualisierung der Webseite bei Änderungen ermöglicht.\",\n    \"speakerNotes\": \"Jetzt, da wir unsere Dateien haben, müssen wir sie miteinander verknüpfen. Das CSS wird im `head`-Bereich Ihrer HTML-Datei mit einem `link`-Tag eingebunden. Achten Sie auf das `rel`-Attribut, das 'stylesheet' sein muss, und das `href`-Attribut, das auf Ihre CSS-Datei verweist. Für JavaScript verwenden wir ein `script`-Tag. Ein wichtiger Tipp hier: Platzieren Sie Ihr `script`-Tag immer kurz vor dem schließenden `</body>`-Tag. Dies stellt sicher, dass alle HTML-Elemente geladen sind, bevor Ihr JavaScript-Code versucht, mit ihnen zu interagieren. Und vergessen Sie nicht die 'Live Server'-Erweiterung in VS Code – sie spart Ihnen viel Zeit beim Aktualisieren der Seite!\"\n  },\n  {\n    \"slideIndex\": 5,\n    \"title\": \"Grundlagen: Erste HTML-Elemente\",\n    \"htmlContent\": \"<div style='background-color: #F8F9FA; font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #2D3748; padding: 5vw;'><style>@keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } } @keyframes slideInDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }</style><h2 style='font-size: 3vw; margin-bottom: 3vw; text-align: center; color: #3182CE; animation: slideInDown 0.8s ease-out forwards;'>Texte und Überschriften einfügen</h2><div style='display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 3vw; width: 80%;'><div style='background-color: #FFFFFF; padding: 2.5vw; border-radius: 1.5vw; box-shadow: 0 0.5vw 1.5vw rgba(0,0,0,0.1); animation: scaleIn 0.8s ease-out forwards; display: flex; flex-direction: column; align-items: center;'><svg width='4vw' height='4vw' viewBox='0 0 24 24' fill='none' stroke='#4299E1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-type' style='margin-bottom: 1.5vw;'><polyline points='4 7 4 4 20 4 20 7'></polyline><line x1='9' y1='20' x2='15' y2='20'></line><line x1='12' y1='4' x2='12' y2='20'></line></svg><h3 style='font-size: 2vw; color: #2D3748; margin-bottom: 1vw;'>Überschriften (<code>&lt;h1&gt;</code>)</h3><p style='font-size: 1.5vw; text-align: center; margin-bottom: 1.5vw;'>Wird normalerweise für Seitentitel verwendet. Beispiel: <code>&lt;h1&gt;Hallo&lt;/h1&gt;</code></p></div><div style='background-color: #FFFFFF; padding: 2.5vw; border-radius: 1.5vw; box-shadow: 0 0.5vw 1.5vw rgba(0,0,0,0.1); animation: scaleIn 1s ease-out forwards; display: flex; flex-direction: column; align-items: center;'><svg width='4vw' height='4vw' viewBox='0 0 24 24' fill='none' stroke='#4299E1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-align-left' style='margin-bottom: 1.5vw;'><line x1='17' y1='10' x2='3' y2='10'></line><line x1='21' y1='6' x2='3' y2='6'></line><line x1='21' y1='14' x2='3' y2='14'></line><line x1='17' y1='18' x2='3' y2='18'></line></svg><h3 style='font-size: 2vw; color: #2D3748; margin-bottom: 1vw;'>Absätze (<code>&lt;p&gt;</code>)</h3><p style='font-size: 1.5vw; text-align: center; margin-bottom: 1.5vw;'>Für Fließtext und längere Inhalte. Beispiel: <code>&lt;p&gt;Lorem ipsum...&lt;/p&gt;</code></p></div><div style='background-color: #FFFFFF; padding: 2.5vw; border-radius: 1.5vw; box-shadow: 0 0.5vw 1.5vw rgba(0,0,0,0.1); animation: scaleIn 1.2s ease-out forwards; display: flex; flex-direction: column; align-items: center;'><svg width='4vw' height='4vw' viewBox='0 0 24 24' fill='none' stroke='#4299E1' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-maximize' style='margin-bottom: 1.5vw;'><path d='M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3m-18 0v3a2 2 0 0 0 2 2h3'></path></svg><h3 style='font-size: 2vw; color: #2D3748; margin-bottom: 1vw;'>Schriftgröße (<code>font-size</code>)</h3><p style='font-size: 1.5vw; text-align: center; margin-bottom: 1.5vw;'>Empfohlen: <code>em</code>-Einheiten (z.B. <code>2em</code> für 200%).</p></div></div></div>\",\n    \"detailedNotes\": \"Diese Folie behandelt die Grundlagen des Hinzufügens von Textinhalten in HTML. Es werden Überschriften (z.B. `<h1>`) und Absätze (`<p>`) als gängige Elemente zur Strukturierung von Text vorgestellt. Für die Schriftgröße wird die Verwendung von 'em'-Einheiten empfohlen, da sie sich an die Basisschriftgröße anpassen und somit responsiver sind als feste Pixelwerte. Lorem Ipsum wird als nützliches Werkzeug zum Generieren von Platzhaltertext erwähnt, um Designs zu testen, bevor der endgültige Inhalt verfügbar ist.\",\n    \"speakerNotes\": \"Innerhalb unserer `index.html`-Datei können wir nun erste HTML-Elemente hinzufügen. `<h1>` ist typischerweise für die Hauptüberschrift einer Seite. Für längere Textabschnitte nutzen wir den `p`-Tag. Wenn Sie nur Platzhaltertext benötigen, können Sie einfach 'lorem' eingeben und Enter drücken – VS Code generiert dann automatisch 'Lorem Ipsum'-Text für Sie. Beim Styling der Schriftgröße empfehle ich `em`-Einheiten statt fester `px`-Werte. `2em` entspricht beispielsweise 200% der Basisschriftgröße und ist deutlich flexibler für verschiedene Bildschirmgrößen.\"\n  },\n  {\n    \"slideIndex\": 6,\n    \"title\": \"Debuggen mit `console.log()`\",\n    \"htmlContent\": \"<div style='background: #0F0F1A; font-family: sans-serif; height: 100vh; display: flex; justify-content: center; align-items: center; color: #E2E8F0; padding: 5vw;'><style>@keyframes zoomInBounce { 0% { opacity: 0; transform: scale(0.5); } 80% { transform: scale(1.05); } 100% { opacity: 1; transform: scale(1); } }</style><div style='width: 80%; max-width: 900px; text-align: center; animation: zoomInBounce 1s ease-out forwards;'><h2 style='font-size: 3.5vw; color: #4CAF50; margin-bottom: 3vw; filter: drop-shadow(0 0 0.8vw #4CAF50);'>Ausgabe im Browser: Die Konsole</h2><div style='position: relative; background-color: #1F1F2F; padding: 4vw; border-radius: 2vw; box-shadow: 0 1vw 3vw rgba(0,0,0,0.5); border: 2px solid #333; overflow: hidden;'><svg style='position: absolute; top: -1vw; left: -1vw; width: 15vw; height: 15vw; color: rgba(76, 175, 80, 0.1);' fill='currentColor' viewBox='0 0 24 24'><path d='M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z'></path></svg><p style='font-size: 2vw; font-style: italic; color: #E0E0E0; margin-bottom: 2.5vw;'>\\\"Um Text auszugeben, kannst du <code>console.log()</code> eingeben.\\\"</p><pre style='background-color: #2D2D3D; color: #E2E8F0; padding: 2vw; border-radius: 1vw; font-size: 1.6vw; text-align: left; overflow-x: auto; border-left: 0.5vw solid #66BB6A;'><code>console.log(\\\"Hallo Welt!\\\");<br>console.log(`Dies ist ein Template Literal`);</code></pre><p style='font-size: 1.4vw; color: #B0BEC5; margin-top: 2.5vw;'><em>Verwende die Entwickler-Tools im Browser, um die Ausgabe zu sehen.</em></p></div></div></div>\",\n    \"detailedNotes\": \"Diese Folie stellt die `console.log()`-Methode vor, die ein unverzichtbares Werkzeug für das Debugging und die Ausgabe von Informationen während der Entwicklung ist. Es wird erklärt, wie man Text mit doppelten Anführungszeichen, einfachen Anführungszeichen oder Backticks (Template Literals) ausgibt. Template Literals werden besonders hervorgehoben, da sie mehr Flexibilität bieten, insbesondere beim Einfügen von Variablen. Die Folie weist darauf hin, dass die Ausgabe in den Entwickler-Tools des Browsers, genauer gesagt in der 'Konsole', sichtbar ist, da es keine sichtbare Ausgabe auf der Webseite selbst gibt.\",\n    \"speakerNotes\": \"Wenn wir JavaScript schreiben, müssen wir oft überprüfen, ob unser Code das tut, was wir erwarten. Hier kommt `console.log()` ins Spiel. Diese Funktion gibt Nachrichten in der Browser-Konsole aus, die ein leistungsstarkes Werkzeug für Entwickler ist. Sie können Text mit normalen Anführungszeichen oder, wie ich bevorzuge, mit Backticks ausgeben. Backticks ermöglichen sogenannte Template Literals, die besonders nützlich werden, wenn wir Variablen einfügen möchten. Um die Ausgabe zu sehen, müssen Sie die Entwickler-Tools Ihres Browsers öffnen – meist über F12 oder Rechtsklick > 'Untersuchen' – und dort den Tab 'Konsole' auswählen.\"\n  },\n  {\n    \"slideIndex\": 7,\n    \"title\": \"Interaktion: Alert & Kommentare\",\n    \"htmlContent\": \"<div style='background: linear-gradient(135deg, #1A202C 0%, #2D3748 100%); font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #E2E8F0; padding: 5vw;'><style>@keyframes slideInFromBottom { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }</style><h2 style='font-size: 3vw; margin-bottom: 3vw; text-align: center; color: #63B3ED; animation: slideInFromBottom 0.6s ease-out forwards;'>Weitere nützliche JavaScript-Funktionen</h2><div style='display: grid; grid-template-columns: repeat(2, 1fr); gap: 3vw; width: 80%; max-width: 1200px;'><div style='background-color: #2D3748; padding: 3vw; border-radius: 1.5vw; box-shadow: 0 0.5vw 1.5vw rgba(0,0,0,0.3); display: flex; flex-direction: column; align-items: center; animation: slideInFromBottom 0.9s ease-out forwards;'><svg width='4vw' height='4vw' viewBox='0 0 24 24' fill='none' stroke='#F6AD55' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-alert-triangle' style='margin-bottom: 2vw;'><path d='M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z'></path><line x1='12' y1='9' x2='12' y2='13'></line><line x1='12' y1='17' x2='12.01' y2='17'></line></svg><h3 style='font-size: 2vw; color: #F6AD55; margin-bottom: 1.5vw;'>Pop-up-Meldungen mit <code>alert()</code></h3><p style='font-size: 1.5vw; text-align: center; margin-bottom: 2vw;'>Erstellt ein kleines Pop-up-Fenster mit einer Nachricht.</p><pre style='background-color: #1A202C; color: #E2E8F0; padding: 1.5vw; border-radius: 0.8vw; font-size: 1.3vw; overflow-x: auto;'><code>alert(\\\"Dies ist ein Warnhinweis!\\\");</code></pre></div><div style='background-color: #2D3748; padding: 3vw; border-radius: 1.5vw; box-shadow: 0 0.5vw 1.5vw rgba(0,0,0,0.3); display: flex; flex-direction: column; align-items: center; animation: slideInFromBottom 1.2s ease-out forwards;'><svg width='4vw' height='4vw' viewBox='0 0 24 24' fill='none' stroke='#68D391' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-message-square' style='margin-bottom: 2vw;'><path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path></svg><h3 style='font-size: 2vw; color: #68D391; margin-bottom: 1.5vw;'>Code-Kommentare</h3><p style='font-size: 1.5vw; text-align: center; margin-bottom: 2vw;'>Erklären Code, ohne ihn auszuführen (mit <code>//</code> oder <code>/* */</code>).</p><pre style='background-color: #1A202C; color: #E2E8F0; padding: 1.5vw; border-radius: 0.8vw; font-size: 1.3vw; overflow-x: auto;'><code>// Dies ist ein einzeiliger Kommentar<br>/* Dies ist<br>ein mehrzeiliger<br>Kommentar */</code></pre></div></div></div>\",\n    \"detailedNotes\": \"Diese Folie stellt zwei weitere wichtige Aspekte der JavaScript-Entwicklung vor: Pop-up-Meldungen mit `alert()` und Code-Kommentare. Die `alert()`-Funktion erzeugt ein einfaches Browser-Pop-up-Fenster, um dem Benutzer eine Nachricht anzuzeigen. Sie ist nützlich für schnelle Benachrichtigungen, sollte aber sparsam eingesetzt werden, da sie die Benutzererfahrung unterbrechen kann. Kommentare sind ein essentieller Bestandteil der Code-Dokumentation. Sie ermöglichen es Entwicklern, Notizen im Code zu hinterlassen, die vom Interpreter ignoriert werden. Es werden sowohl einzeilige (`//`) als auch mehrzeilige (`/* */`) Kommentare erläutert.\",\n    \"speakerNotes\": \"Neben der Konsolenausgabe gibt es noch andere Wege, wie JavaScript mit uns kommunizieren kann. Die `alert()`-Funktion erzeugt eine einfache Pop-up-Meldung direkt im Browser. Das ist nützlich für schnelle Hinweise an den Benutzer, aber übertreiben Sie es nicht, da es störend wirken kann. Ebenso wichtig sind Kommentare in Ihrem Code. Sie werden vom JavaScript-Interpreter ignoriert und dienen dazu, Ihren Code für sich selbst und für andere Entwickler verständlicher zu machen. Sie können einzeilige Kommentare mit zwei Schrägstrichen `//` oder mehrzeilige Kommentare mit `/*` und `*/` verwenden.\"\n  },\n  {\n    \"slideIndex\": 8,\n    \"title\": \"DOM-Manipulation: Elemente auswählen\",\n    \"htmlContent\": \"<div style='background-color: #23272f; font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #E2E8F0; padding: 5vw;'><style>@keyframes slideInFromLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } } @keyframes fadeInDelay { from { opacity: 0; } to { opacity: 1; } }</style><h2 style='font-size: 3vw; margin-bottom: 3.5vw; text-align: center; color: #5EEAD4; animation: fadeInDelay 0.7s ease-out forwards;'>Zugriff auf HTML-Elemente per ID</h2><div style='display: flex; flex-direction: column; gap: 2.5vw; width: 75%; max-width: 900px;'><div style='display: flex; align-items: center; background-color: #3C4257; padding: 2vw; border-radius: 1.2vw; box-shadow: 0 0.5vw 1.5vw rgba(0,0,0,0.3); animation: slideInFromLeft 0.8s ease-out forwards;'><span style='font-size: 2.5vw; font-weight: bold; color: #F0ABFC; margin-right: 2vw; flex-shrink: 0;'>1.</span><svg width='3vw' height='3vw' viewBox='0 0 24 24' fill='none' stroke='#F0ABFC' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-hash' style='margin-right: 1.5vw;'><line x1='4' y1='9' x2='20' y2='9'></line><line x1='4' y1='15' x2='20' y2='15'></line><line x1='10' y1='3' x2='8' y2='21'></line><line x1='16' y1='3' x2='14' y2='21'></line></svg><p style='font-size: 1.7vw; margin: 0;'>HTML-Elementen eine eindeutige <code>id</code> zuweisen (z.B. <code>id=\\\"my-h1\\\"</code>, <code>id=\\\"my-p\\\"</code>)</p></div><div style='display: flex; align-items: center; background-color: #3C4257; padding: 2vw; border-radius: 1.2vw; box-shadow: 0 0.5vw 1.5vw rgba(0,0,0,0.3); animation: slideInFromLeft 1.1s ease-out forwards;'><span style='font-size: 2.5vw; font-weight: bold; color: #F0ABFC; margin-right: 2vw; flex-shrink: 0;'>2.</span><svg width='3vw' height='3vw' viewBox='0 0 24 24' fill='none' stroke='#F0ABFC' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-search' style='margin-right: 1.5vw;'><circle cx='11' cy='11' r='8'></circle><line x1='21' y1='21' x2='16.65' y2='16.65'></line></svg><p style='font-size: 1.7vw; margin: 0;'>JavaScript-Methode <code>document.getElementById('ID_NAME')</code> verwenden</p></div><div style='display: flex; align-items: center; background-color: #3C4257; padding: 2vw; border-radius: 1.2vw; box-shadow: 0 0.5vw 1.5vw rgba(0,0,0,0.3); animation: slideInFromLeft 1.4s ease-out forwards;'><span style='font-size: 2.5vw; font-weight: bold; color: #F0ABFC; margin-right: 2vw; flex-shrink: 0;'>3.</span><svg width='3vw' height='3vw' viewBox='0 0 24 24' fill='none' stroke='#F0ABFC' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-code' style='margin-right: 1.5vw;'><polyline points='16 18 22 12 16 6'></polyline><polyline points='8 6 2 12 8 18'></polyline></svg><p style='font-size: 1.7vw; margin: 0;'>Das zurückgegebene Element in einer Variable speichern, z.B. <code>const myH1 = document.getElementById('my-h1');</code></p></div></div></div>\",\n    \"detailedNotes\": \"Diese Folie führt in die Document Object Model (DOM)-Manipulation ein, speziell in das Auswählen von HTML-Elementen mittels ihrer ID. Zunächst müssen HTML-Elemente im HTML-Dokument mit einer eindeutigen ID versehen werden (z.B. `<h1 id=\\\"my-h1\\\">`). Anschließend kann JavaScript über das globale `document`-Objekt auf diese Elemente zugreifen. Die Methode `document.getElementById('ID_NAME')` sucht im gesamten Dokument nach einem Element mit der angegebenen ID und gibt dieses Element zurück. Es wird betont, dass die ID-Namen in der Methode exakt mit denen im HTML-Dokument übereinstimmen müssen, einschließlich Groß- und Kleinschreibung. Das gefundene Element sollte dann in einer Variable gespeichert werden, um es später manipulieren zu können.\",\n    \"speakerNotes\": \"Jetzt kommen wir zu einem Kernstück von interaktiven Webseiten: der DOM-Manipulation. Das Document Object Model ist im Grunde die programmierbare Schnittstelle zu Ihrem HTML-Dokument. Um ein spezifisches HTML-Element mit JavaScript anzusprechen, müssen wir ihm zunächst im HTML-Code eine eindeutige `id` geben. Nehmen wir zum Beispiel 'my-h1' für eine Überschrift und 'my-p' für einen Absatz. Im JavaScript verwenden wir dann die Methode `document.getElementById()`, gefolgt vom ID-Namen in Klammern und Anführungszeichen. Denken Sie an die genaue Schreibweise! Das zurückgegebene Element speichern wir dann in einer Variablen, um es später einfach ändern zu können.\"\n  },\n  {\n    \"slideIndex\": 9,\n    \"title\": \"Inhalte Ändern: `innerText`\",\n    \"htmlContent\": \"<div style='background: linear-gradient(to bottom right, #0F2027, #203A43, #2C5364); font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #E2E8F0; padding: 5vw;'><style>@keyframes floatIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }</style><h2 style='font-size: 3.5vw; margin-bottom: 4vw; text-align: center; color: #A78BFA; animation: floatIn 0.8s ease-out forwards;'>Dynamische Textaktualisierung</h2><div style='display: flex; justify-content: space-around; width: 90%; max-width: 1200px; gap: 4vw;'><div style='flex: 1; background-color: rgba(30, 41, 59, 0.8); padding: 3.5vw; border-radius: 1.8vw; box-shadow: 0 1vw 3vw rgba(0,0,0,0.4); animation: floatIn 1.1s ease-out forwards;'><h3 style='font-size: 2.2vw; color: #6EE7B7; margin-bottom: 2vw;'>Überschrift ändern</h3><svg width='4vw' height='4vw' viewBox='0 0 24 24' fill='none' stroke='#6EE7B7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-edit-3' style='margin-bottom: 2vw;'><path d='M12 20h9'></path><path d='M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z'></path></svg><pre style='background-color: #1A202C; color: #E2E8F0; padding: 1.8vw; border-radius: 1vw; font-size: 1.4vw; text-align: left; overflow-x: auto;'><code>const myH1 = document.getElementById('my-h1');<br>myH1.innerText = \\\"Hallo Welt!\\\";</code></pre><p style='font-size: 1.4vw; color: #CBD5E0; margin-top: 2vw;'>Der Text innerhalb des <code>h1</code>-Tags wird aktualisiert.</p></div><div style='flex: 1; background-color: rgba(30, 41, 59, 0.8); padding: 3.5vw; border-radius: 1.8vw; box-shadow: 0 1vw 3vw rgba(0,0,0,0.4); animation: floatIn 1.4s ease-out forwards;'><h3 style='font-size: 2.2vw; color: #6EE7B7; margin-bottom: 2vw;'>Absatz anpassen</h3><svg width='4vw' height='4vw' viewBox='0 0 24 24' fill='none' stroke='#6EE7B7' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-file-text' style='margin-bottom: 2vw;'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'></path><polyline points='14 2 14 8 20 8'></polyline><line x1='16' y1='13' x2='8' y2='13'></line><line x1='16' y1='17' x2='8' y2='17'></line><polyline points='10 9 9 9 8 9'></polyline></svg><pre style='background-color: #1A202C; color: #E2E8F0; padding: 1.8vw; border-radius: 1vw; font-size: 1.4vw; text-align: left; overflow-x: auto;'><code>const myP = document.getElementById('my-p');<br>myP.innerText = \\\"Ich mag Pitzer!\\\";</code></pre><p style='font-size: 1.4vw; color: #CBD5E0; margin-top: 2vw;'>Der Inhalt des <code>p</code>-Tags wird dynamisch gesetzt.</p></div></div></div>\",\n    \"detailedNotes\": \"Diese Folie demonstriert, wie man den Textinhalt von HTML-Elementen mit JavaScript dynamisch ändern kann. Nachdem ein Element mit `document.getElementById()` ausgewählt und in einer Variablen gespeichert wurde (z.B. `myH1`), kann dessen `innerText`-Eigenschaft verwendet werden, um den sichtbaren Textinhalt zu aktualisieren. Es wird gezeigt, wie man eine Überschrift und einen Absatz anpasst. Die `innerText`-Eigenschaft ermöglicht es, neuen Text zuzuweisen, der dann direkt im Browser angezeigt wird. Dies ist eine grundlegende Technik für jede Form der dynamischen Inhaltsaktualisierung auf einer Webseite.\",\n    \"speakerNotes\": \"Nachdem wir gelernt haben, wie man HTML-Elemente auswählt, wollen wir nun sehen, wie wir deren Inhalt ändern können. Das ist der Moment, in dem JavaScript wirklich beginnt, unsere Webseiten dynamisch zu machen! Wir greifen auf das Element zu, das wir in einer Variablen gespeichert haben, und verwenden dann die Eigenschaft `innerText`. Indem wir dieser Eigenschaft einen neuen String zuweisen, aktualisieren wir den Textinhalt des Elements direkt im Browser. So einfach können Sie Überschriften, Absätze oder jeden anderen Text auf Ihrer Webseite verändern, ohne das HTML-Dokument selbst zu bearbeiten.\"\n  },\n  {\n    \"slideIndex\": 10,\n    \"title\": \"JavaScript Grundlagen: Eine Zusammenfassung\",\n    \"htmlContent\": \"<div style='background: linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%); font-family: sans-serif; height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; color: #E2E8F0; text-align: center; overflow: hidden;'><style>@keyframes fadeInExpand { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } } @keyframes glow { from { text-shadow: 0 0 10px rgba(126, 87, 194, 0.4); } to { text-shadow: 0 0 20px rgba(126, 87, 194, 0.8), 0 0 30px rgba(126, 87, 194, 0.6); } }</style><svg width='10vw' height='10vw' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1' stroke-linecap='round' stroke-linejoin='round' class='feather feather-award' style='animation: fadeInExpand 0.8s ease-out forwards; margin-bottom: 2vw; filter: drop-shadow(0 0 1vw #7E57C2); color: #7E57C2;'><circle cx='12' cy='8' r='7'></circle><polyline points='8.21 13.89 7 23 12 20 17 23 15.79 13.88'></polyline></svg><h1 style='font-size: 4vw; margin-bottom: 1.5vw; animation: fadeInExpand 1s ease-out forwards, glow 2s infinite alternate;'>Wichtige Konzepte für den Start</h1><p style='font-size: 1.7vw; max-width: 70vw; line-height: 1.6; animation: fadeInExpand 1.2s ease-out forwards;'>Sie haben gelernt, wie JavaScript Webseiten dynamisch macht, grundlegende Ausgaben erzeugt und HTML-Elemente manipuliert.</p><ul style='list-style: none; padding: 0; margin-top: 2vw; animation: fadeInExpand 1.4s ease-out forwards;'><li style='font-size: 1.5vw; margin-bottom: 1vw; color: #BB86FC;'>•  Projekt-Setup & Dateiverknüpfung</li><li style='font-size: 1.5vw; margin-bottom: 1vw; color: #BB86FC;'>•  <code>console.log()</code> für Debugging</li><li style='font-size: 1.5vw; margin-bottom: 1vw; color: #BB86FC;'>•  <code>alert()</code> für Benachrichtigungen</li><li style='font-size: 1.5vw; color: #BB86FC;'>•  DOM-Manipulation: Elemente auswählen & ändern</li></ul></div>\",\n    \"detailedNotes\": \"Diese Abschlussfolie fasst die wesentlichen Konzepte zusammen, die in der Präsentation behandelt wurden. Sie erinnert an die grundlegende Rolle von JavaScript zur Erstellung dynamischer und interaktiver Websites. Die wichtigsten Punkte sind das korrekte Einrichten eines Projekts, die Verknüpfung von HTML, CSS und JS, der Einsatz von `console.log()` zum Debugging und `alert()` für Pop-up-Benachrichtigungen. Ein zentraler Lernpunkt ist die DOM-Manipulation, insbesondere das Auswählen von HTML-Elementen über ihre ID (`document.getElementById()`) und das Ändern ihres Textinhalts (`innerText`). Diese Grundlagen bilden das Fundament für komplexere JavaScript-Anwendungen.\",\n    \"speakerNotes\": \"Wir sind am Ende unserer Einführung in die JavaScript-Grundlagen angelangt. Ich hoffe, Sie haben einen guten Überblick darüber bekommen, wie leistungsfähig diese Sprache ist. Wir haben gelernt, wie man ein Projekt aufsetzt, Dateien verknüpft, und wie man einfache Ausgaben über `console.log()` und `alert()` erzeugt. Am wichtigsten ist, dass Sie nun verstehen, wie JavaScript mit Ihrem HTML interagiert – wie Sie Elemente auswählen und deren Inhalte dynamisch ändern können. Das ist der Schlüssel zur Erstellung wirklich interaktiver Webseiten. Üben Sie diese Konzepte, und Sie werden schnell Fortschritte machen!\"\n  }\n]";

// export default function VideoToPPTPage({ Header }: Props) {
const VideoToPPTPage = ({ Header }: Props) => {
	const [sourceType, setSourceType] = useState("video");
	const [videoUrl, setVideoUrl] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [loadingStepCount, setLoadingStepCount] = useState<number>(0);
	const [video, setVideo] = useState<any>(null);
	const [showPreview, setShowPreview] = useState(false);
	const [uploadedFile, setUploadedFile] = useState<any>(null);
	const [fileId, setFileId] = useState<number>(0);

	const handleUpload = (uploadFile: any) => {
		setUploadedFile(uploadFile);
		console.log("Uploaded file:", uploadFile);
		if (uploadFile) toast.success("File uploaded successfully");
		else toast.error("Failed to upload file");
	};

	const showPreviewHandler = (flag: boolean) => {
		setShowPreview(flag);
		setLoadingStepCount(0);
		setVideoUrl("");
		setVideo({});
	};

	const handleExtraction = async () => {
		if (!videoUrl && !uploadedFile) return toast.error("Please enter a URL or Source");
		const interval: any = [];

		try {
			setLoading(true);
			const loadingStepsTimes = [5000, 11000, 17000, 25000];
			loadingStepsTimes.forEach((time, index) => {
				interval.push(
					setTimeout(() => {
						setLoadingStepCount(index + 1);
					}, time)
				);
			});
			let res: any = {};
			if (videoUrl) {
				const serverRes = await api.post("/video/youTube", {
					youtubeUrl: videoUrl,
				});
				const data = await getResponseData(serverRes);
				res = data.res;
			} else if (uploadedFile) {
				console.log("Uploaded file:", uploadedFile);
				const ServerRes = await api.post("/video/local", {
					videoId: uploadedFile.asset_id,
					title: uploadedFile.original_filename || uploadedFile.display_name,
					tags: uploadedFile.tags,
					type: "LOCAL_VIDEO",
					audioUrl: cloudinaryVideoToAudio(uploadedFile.secure_url),
					videoUrl: uploadedFile.secure_url,
					// categories: uploadedFile.categories,
					duration: formatDuration(uploadedFile.duration),
				});
				const data = await getResponseData(ServerRes);
				res = data.res;
			}
			console.log(res);
			setFileId(res?.data?.id);
			setLoadingStepCount(loadingStepsTimes.length - 1);
			if (res?.success && res?.message) toast.success(res.message);
			else if (!res?.success && res?.message) toast.error(res.message);
			setVideo(res.data);
			setShowPreview(true);

			if (res) setLoading(false);
		} catch (error) {
			console.error("Extraction failed:", error);
			setLoading(false);
			setLoadingStepCount(0);
			toast.error("Failed to process audio. Check server logs.");
		} finally {
			interval.forEach((timer: any) => clearTimeout(timer));
			setLoadingStepCount(0);
		}
	};

	return (
		<>
			{showPreview ? (
				<VideoPreviewPage data={[video]} fileId={fileId} showPreview={showPreviewHandler} />
			) : (
				<>
					<DashboardHeader Header={Header} />
					<div className="min-h-screen flex flex-col">
						{/* Header Space (Assuming your layout handles this) */}
						{loading && <ProgressTracker steps={LoadingSteps} currentStep={loadingStepCount} />}
						<main className="flex-1 flex flex-col p-0">
							<div className=" w-full flex flex-col md:flex-row md:gap-6 md:mx-auto space-y-8">
								{/* Main Ingester Card */}
								<Card className="w-[100%] md:w-[75%] mx-auto bg-zinc-900/30 backdrop-blur-xl shadow-2xl overflow-hidden">
									<CardContent className="p-0">
										<Tabs defaultValue="video" onValueChange={setSourceType} className="w-full">
											<div className="border-b dark:border-gray-700 bg-[#0f172a] p-4 pt-6 -mt-6">
												<TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-gray-200/50 dark:bg-gray-800/50">
													<TabsTrigger value="video" className="gap-2">
														<Video size={16} /> Video
													</TabsTrigger>
													<TabsTrigger value="audio" className="gap-2">
														<Mic size={16} /> Audio
													</TabsTrigger>
												</TabsList>
											</div>

											<div className="p-8 space-y-6">
												{/* URL Input Section */}
												<div className="space-y-4">
													{sourceType === "video" && (
														<>
															<div className="relative">
																<div className="absolute inset-y-0 left-3 flex items-center text-gray-400">
																	{sourceType === "video" ? <Youtube size={20} /> : <LinkIcon size={20} />}
																</div>
																<Input
																	value={videoUrl}
																	onChange={(e: any) => setVideoUrl(e?.target?.value)}
																	placeholder={
																		sourceType === "video" ? "Paste YouTube or Video URL..." : "Paste Audio URL..."
																	}
																	className="pl-10 h-14 text-md border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 rounded-xl bg-white dark:bg-gray-900"
																/>
															</div>
															<div className="relative flex items-center py-2">
																<div className="grow border-t border-gray-200 dark:border-gray-700"></div>
																<span className="shrink mx-4 text-gray-400 text-sm font-medium uppercase tracking-wider">
																	OR
																</span>
																<div className="grow border-t border-gray-200 dark:border-gray-700"></div>
															</div>
														</>
													)}

													{uploadedFile ? (
														<VideoPlayer url={uploadedFile?.secure_url} />
													) : (
														<FileUploader sourceType="video" setUploadedFile={handleUpload} />
													)}
												</div>

												{/* Settings & Generate Button */}
												<div className="flex flex-col sm:flex-row gap-4 pt-4">
													{/* <Button variant="outline" className="flex-1 h-12 rounded-xl gap-2">
														<Settings size={18} /> Presentation Settings
													</Button> */}
													<div className="flex-2 h-12 rounded-xl gap-2"></div>
													<Button
														onClick={() => handleExtraction()}
														className="flex-1 h-12 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 hover:opacity-90 shadow-lg shadow-blue-500/25 gap-2 text-md font-bold"
													>
														<Sparkles size={18} /> Generate Slides
													</Button>
												</div>
											</div>
										</Tabs>
									</CardContent>
								</Card>

								{/* Features Grid */}
								<div className="grid md:max-w-[23%] w-[100%] grid-cols-1 gap-6 pb-20">
									{[
										{
											icon: <CheckCircle2 className="text-green-500" />,
											title: "Auto Transcription",
											desc: "Perfectly transcribed text from any speaker.",
										},
										{
											icon: <FileText className="text-blue-500" />,
											title: "AI Summarization",
											desc: "Key points extracted and turned into slides.",
										},
										{
											icon: <Sparkles className="text-purple-500" />,
											title: "Designer Layouts",
											desc: "Beautifully designed slides based on content. From title slides to section dividers, we've got you covered. Our AI is succinct and provides just enough information to be useful: it will generally only generate a single function or a couple lines of code to fulfill the instruction. If the AI does not know how to follow the instruction, the ASSISTANT should not reply at all.",
										},
									].map((f, i) => (
										<div
											key={i}
											className="flex gap-4 p-4 rounded-xl bg-white/40 dark:bg-gray-800/40 border border-white/20"
										>
											<div className="mt-1">{f.icon}</div>
											<div>
												<h4 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h4>
												<p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</main>

						{/* Footer Space (Assuming your layout handles this) */}
					</div>
				</>
			)}
		</>
	);
};

export default VideoToPPTPage;
