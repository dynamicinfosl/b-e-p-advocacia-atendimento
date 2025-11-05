import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { applySavedThemeFromSettings } from '@/lib/theme'

applySavedThemeFromSettings();
createRoot(document.getElementById("root")!).render(<App />);
