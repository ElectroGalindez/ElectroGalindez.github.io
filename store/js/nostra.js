document.querySelector('.cart-btns a[href="/checkout/"]').addEventListener('click', function(e) {
    e.preventDefault(); // Evita el comportamiento predeterminado del enlace
    window.location.href = '/store/checkout.html'; // Redirige a la página
});