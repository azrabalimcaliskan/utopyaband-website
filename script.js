// ========== ALIŞVERİŞ SEPETİ SİSTEMİ ==========
let cart = [];

// Sepeti aç/kapat
function toggleCart() {
    const cartPanel = document.getElementById('cartPanel');
    cartPanel.classList.toggle('open');
}

// Sepete ürün ekle
function addToCart(productName, price) {
    // Ürünü sepete ekle
    cart.push({
        name: productName,
        price: price,
        id: Date.now() // Benzersiz ID
    });

    // Sepeti güncelle
    updateCart();

    // Geri bildirim - buton animasyonu
    // Not: Inline event handler'larda 'event' global nesnesi mevcuttur (window.event veya argument)
    // Ancak setTimeout içinde 'event' nesnesi kaybolabilir veya değişebilir, bu yüzden hedefi önce saklıyoruz.
    const button = (typeof event !== 'undefined') ? event.target : window.event.target;

    if (button) {
        const originalText = button.textContent;
        button.textContent = '✓ EKLENDİ';
        setTimeout(() => {
            button.textContent = originalText; // Orijinal metni geri yükle (genellikle 'SEPETE EKLE')
        }, 1000);
    }
}

// Sepetten ürün çıkar
function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

// Sepeti güncelle
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartEmpty = document.getElementById('cartEmpty');

    // Sepet sayısını güncelle
    cartCount.textContent = cart.length;

    // Toplam fiyatı hesapla
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotal.textContent = '₺' + total;

    // Sepet boşsa
    if (cart.length === 0) {
        cartEmpty.style.display = 'block';
        return;
    }

    cartEmpty.style.display = 'none';

    // Sepet içeriğini oluştur
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image"></div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₺${item.price}</div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                    Kaldır
                </button>
            </div>
        </div>
    `).join('');
}

// Satın alma işlemi
function checkout() {
    if (cart.length === 0) {
        alert('Sepetiniz boş!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    alert(`Toplam ₺${total} tutarında sipariş verildi!\n\nGerçek bir e-ticaret sisteminde buradan ödeme sayfasına yönlendirilirsiniz.`);

    // Sepeti temizle
    cart = [];
    updateCart();
    toggleCart();
}

// ========== SAYFA KAYDIRINCA GÖRÜNME ANİMASYONU ==========
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Tüm animasyonlu elementleri gözlemle
document.querySelectorAll('.section-header, .about-content, .music-player, .video-item, .merch-item, .gallery-item, .event-item, .contact-content').forEach(el => {
    observer.observe(el);
});

// ========== NAVBAR SCROLL EFEKTİ ==========
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// ========== KADEMELER ARASI GECİKMELİ ANİMASYON ==========
document.querySelectorAll('.music-player').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.2}s`;
});

document.querySelectorAll('.video-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.2}s`;
});

document.querySelectorAll('.merch-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.15}s`;
});

document.querySelectorAll('.gallery-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.1}s`;
});

document.querySelectorAll('.event-item').forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.15}s`;
});

// ========== SUPABASE ==========
const supabaseUrl = 'https://bcydxnghuqzojowmkrhe.supabase.co';
const supabaseKey = 'sb_publishable_KfqKKYCTMNr2DMsY3uWDag__ZrclOZX';

// Ensure Supabase is available before using it
if (window.supabase) {
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    async function testConnection() {
        const { data, error } = await supabase
            .from('products')
            .select('*');

        console.log("DATA:", data);
        console.log("ERROR:", error);
    }

    testConnection();
} else {
    // console.error("Supabase client library not loaded.");
}

// ========== MOBILE MENU ==========
function toggleMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger');
    
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
    
    // Prevent scrolling when menu is open
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
}

function closeMenu() {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger');
    
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const navLinks = document.getElementById('navLinks');
    const hamburger = document.querySelector('.hamburger');
    
    if (navLinks.classList.contains('open') && 
        !navLinks.contains(e.target) && 
        !hamburger.contains(e.target)) {
        closeMenu();
    }
});
