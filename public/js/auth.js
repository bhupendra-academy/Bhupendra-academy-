/**
 * 🔐 ULTIMATE DIGITAL EMPIRE - AUTHENTICATION SYSTEM
 * यो फाइलले Google Login र User Account को काम गर्छ।
 */

// Firebase Config बाट Auth र Database तान्ने
import { auth, db } from './firebase-config.js';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// गुगल लगइन गर्ने बाटो (Provider) बनाउने
const googleProvider = new GoogleAuthProvider();

// लगइन पपअप (Modal) डिजाइन बनाएर वेबसाइटमा जोड्ने फङ्सन
function createAuthUI() {
    const authHTML = `
    <div class="paywall-overlay" id="authModal" style="z-index: 10000;">
      <div class="paywall-modal" style="max-width: 400px; padding: 40px 30px;">
        <button class="close-paywall" onclick="document.getElementById('authModal').style.display='none'"><i class="fas fa-times"></i></button>
        
        <i class="fas fa-user-circle" style="font-size:3.5rem; color:var(--gold-main); margin-bottom:15px;"></i>
        <h2 style="font-family:var(--ff-title); color:var(--gold-main); font-size:1.5rem; margin-bottom:10px;">Welcome Back!</h2>
        <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:25px;">तपाईंको डिजिटल कोर्स र इबुकहरू सुरक्षित राख्न लगइन गर्नुहोस्।</p>
        
        <button id="googleLoginBtn" class="btn btn-outline" style="width:100%; border-color:#fff; color:#fff; display:flex; align-items:center; justify-content:center; gap:10px; padding:12px;">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" style="width:20px; height:20px;">
          Google बाट लगइन गर्नुहोस्
        </button>
      </div>
    </div>
    `;
    
    // वेबसाइटको पुछारमा यो डिजाइन थप्ने
    document.body.insertAdjacentHTML('beforeend', authHTML);
    
    // बटनमा क्लिक गर्दा लगइन फङ्सन चल्ने बनाउने
    document.getElementById('googleLoginBtn').addEventListener('click', loginWithGoogle);
}

// गुगल लगइन फङ्सन
async function loginWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        
        console.log("✅ User Logged In:", user.displayName);
        document.getElementById('authModal').style.display = 'none';

        // डाटाबेसमा युजरको प्रोफाइल बनाउने (यदि पहिलो पटक आएको हो भने)
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                role: "customer", // तपाईं पछि आफ्नो इमेललाई "admin" बनाउन सक्नुहुन्छ
                createdAt: serverTimestamp(),
                purchased_ebooks: [],
                enrolled_courses: []
            });
            console.log("✅ New User Profile Created in Database!");
        }
        
        alert(`स्वागत छ, ${user.displayName} जी!`);
        
    } catch (error) {
        console.error("❌ Login Error:", error);
        alert("लगइन सफल भएन। कृपया फेरि प्रयास गर्नुहोस्।");
    }
}

// युजरले लगआउट गर्ने फङ्सन
window.logoutUser = () => {
    signOut(auth).then(() => {
        alert("तपाईं लगआउट हुनुभयो।");
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
};

// लगइन अवस्था चेक गर्ने (तपाईंले पछि बटनको नाम फेर्नको लागि)
onAuthStateChanged(auth, (user) => {
    const loginBtn = document.getElementById('mainLoginBtn'); // हामी पछि index.html मा यो ID राख्छौँ
    if (user) {
        // यदि लगइन छ भने प्रोफाइल फोटो देखाउने
        if(loginBtn) {
            loginBtn.innerHTML = `<img src="${user.photoURL}" style="width:24px; height:24px; border-radius:50%; margin-right:5px; vertical-align:middle;"> Dashboard`;
            loginBtn.onclick = () => alert('Dashboard coming soon!'); // पछि ड्यासबोर्डमा पठाउने
        }
    } else {
        // यदि लगइन छैन भने 'Login' देखाउने
        if(loginBtn) {
            loginBtn.innerHTML = `<i class="fab fa-google"></i> Login`;
            loginBtn.onclick = () => document.getElementById('authModal').style.display = 'flex';
        }
    }
});

// पेज लोड हुनासाथ पपअप डिजाइन बनाउने
window.addEventListener('DOMContentLoaded', () => {
    createAuthUI();
});
