const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector(
	'.container-cart-products'
);

btnCart.addEventListener('click', () => {
	containerCartProducts.classList.toggle('hidden-cart');
});

const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');

const productsList = document.querySelector('.container-items');

let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');

const countProducts = document.querySelector('#contador-productos');

const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');
const btnPay = document.querySelector('.btn-pay');
const productNameEls = document.querySelectorAll('.item .info-product h2');
const productPriceEls = document.querySelectorAll('.item .info-product .price');

const normalizeText = text =>
	text
		.toLowerCase()
		.replace(/\s+/g, '')
		.replace(/[^a-z0-9]/g, '');

const loadPricesFromTxt = () => {
	fetch('precios.txt')
		.then(response => response.text())
		.then(data => {
			const lines = data.trim().split('\n').filter(line => line.trim() !== '');
			const priceMap = new Map();

			lines.forEach(line => {
				const [name, price] = line.split(',');
				if (name && price) {
					priceMap.set(normalizeText(name.trim()), price.trim());
				}
			});

			productNameEls.forEach((titleEl, index) => {
				const title = titleEl.textContent.trim();
				const priceKey = normalizeText(title);
				const priceFromFile =
					priceMap.get(priceKey) ||
					Array.from(priceMap.entries()).find(
						([key]) => key.includes(priceKey) || priceKey.includes(key)
					)?.[1];

				if (priceFromFile) {
					const formattedPrice = priceFromFile.startsWith('$')
						? priceFromFile
						: `$${priceFromFile}`;
					productPriceEls[index].textContent = formattedPrice;
				}
			});
		})
		.catch(error => console.error('Error cargando precios:', error));
};

loadPricesFromTxt();

btnPay.addEventListener('click', () => {
	if (!allProducts.length) return;

	alert('¡Gracias por tu compra!');
	allProducts = [];
	showHTML();
});

productsList.addEventListener('click', e => {
	if (e.target.classList.contains('btn-add-cart')) {
		const product = e.target.parentElement;

		const infoProduct = {
			quantity: 1,
			title: product.querySelector('h2').textContent,
			price: product.querySelector('p').textContent,
		};

		const exits = allProducts.some(
			product => product.title === infoProduct.title
		);

		if (exits) {
			const products = allProducts.map(product => {
				if (product.title === infoProduct.title) {
					product.quantity++;
					return product;
				} else {
					return product;
				}
			});
			allProducts = [...products];
		} else {
			allProducts = [...allProducts, infoProduct];
		}

		showHTML();
	}
});

rowProduct.addEventListener('click', e => {
	if (e.target.classList.contains('icon-close')) {
		const product = e.target.parentElement;
		const title = product.querySelector('p').textContent;

		allProducts = allProducts.filter(
			product => product.title !== title
		);

		console.log(allProducts);

		showHTML();
	}
});

const showHTML = () => {
	if (!allProducts.length) {
		cartEmpty.classList.remove('hidden');
		rowProduct.classList.add('hidden');
		cartTotal.classList.add('hidden');
	} else {
		cartEmpty.classList.add('hidden');
		rowProduct.classList.remove('hidden');
		cartTotal.classList.remove('hidden');
	}

	rowProduct.innerHTML = '';

	let total = 0;
	let totalOfProducts = 0;

	allProducts.forEach(product => {
		const containerProduct = document.createElement('div');
		containerProduct.classList.add('cart-product');

		containerProduct.innerHTML = `
            <div class="info-cart-product">
                <span class="cantidad-producto-carrito">${product.quantity}</span>
                <p class="titulo-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="icon-close"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        `;

		rowProduct.append(containerProduct);

		total =
			total + parseInt(product.quantity * product.price.slice(1));
		totalOfProducts = totalOfProducts + product.quantity;
	});

	valorTotal.innerText = `$${total}`;
	countProducts.innerText = totalOfProducts;
};