import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDoLNR4JUA9wb5mcluVBPq9vQiosuAiBZI",
    authDomain: "site-2749b.firebaseapp.com",
    projectId: "site-2749b",
    storageBucket: "site-2749b.firebasestorage.app",
    messagingSenderId: "312528785914",
    appId: "1:312528785914:web:fba80a86a0b85f7cf99443",
    measurementId: "G-L9ZWT3705R"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

let analyticsInstance: any = null;

if (typeof window !== "undefined") {
    isSupported()
        .then((yes) => {
            if (yes) {
                analyticsInstance = getAnalytics(app);
            }
        })
        .catch(() => {
            // Captura o erro silenciosamente se o AdBlock bloquear o carregamento do script externo
            console.log("Firebase Analytics desativado (provavelmente bloqueado pelo navegador).");
        });
}

export { analyticsInstance as analytics };