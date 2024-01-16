// let app = new Vue({
//     el: '#app',
//     data: {
//         product: "Socks",
//         brand: 'Vue Mastery',
//         description: "A pair of warm, fuzzy socks",
//         selectedVariant: 0,
//         altText: "A pair of socks",
//         link:"https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
//         inventory:100,
//         onSale: true,
//         details: ['80% cotton', '20% polyester', 'Gender-neutral'],
//         variants: [
//             {
//             variantId: 2234,
//             variantColor: 'green',
//             variantImage: "./assets/vmSocks-green-onWhite.jpg",
//             variantQuantity: 10
//             },
//             {
//             variantId: 2235,
//             variantColor: 'blue',
//             variantImage: "./assets/vmSocks-blue-onWhite.jpg",
//             variantQuantity: 0
//             }
//         ],
            
//         sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
//         cart:0,
            
//     },
//     methods: {
//         addToCart(){
//             this.cart += 1
//         },
//         removeFromCart(){
//             if(this.cart != 0){
//                 this.cart -= 1
//             }
//         },
//         updateProduct(index) {
//             this.selectedVariant = index;
//             console.log(index);
//         },
//     },
//     computed: {
//         title() {
//             return this.brand + ' ' + this.product;
//         },
//         image() {
//             return this.variants[this.selectedVariant].variantImage;
//         },
//         inStock(){
//             return this.variants[this.selectedVariant].variantQuantity
//         },
//         sale() {
//             return this.onSale ? 'Скидка!' : 'Скидки нет';
//         }
//     },
      
// })

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
            <li v-for="error in errors">{{ error }}</li>
        </ul>
        </p>
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        <p>
            <input type="submit" value="Submit">
        </p>
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods:{
        onSubmit() {
            if(this.name && this.review && this.rating) {
                let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating
            }
        this.$emit('review-submitted', productReview)
        this.name = null
        this.review = null
        this.rating = null
            }        
            else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        }
    }
})
    

Vue.component('product', {
    props: {
        premium: {
        type: Boolean,
        required: true
        },
        cart: {
            type: Array,
            required: true
        },
    },  
    template: `
    <div class="product">
        <div class="product-image">
            <img v-bind:src="image" v-bind:alt="altText"/>
        </div>
        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>User is premium: {{ premium }}</p>
            <p>{{ description }}</p>
            <a :href="link">More products like this</a>
            <p v-if="inventory > 10">In stock</p>
            <p v-else-if="inventory <= 10 && inventory > 0">Almost sold out!</p>
            <p v-else :style="{ 'text-decoration': 'line-through' }" :class="{ 'out-of-stock': false }">Out of Stock</p>
            <span v-if="onSale = true">On sale</span>
            <p>{{ sale }}</p> 
            <product-details :details="details"></product-details>
        <p>Shipping: {{ shipping }}</p>
        <div class="color-box"
            v-for="(variant, index) in variants"
            :key="variant.variantId"
            :style="{ backgroundColor:variant.variantColor }"
            @mouseover="updateProduct(variant.variantImage)">
        </div>
            
        <ul>
            <li v-for="size in sizes">{{ size }}</li>
        </ul>

        <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">
            Add to cart
        </button>
        
        <button v-on:click="removeFromCart" >Remove</button>

        <div>
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
                <li v-for="review in reviews">
                    <p>{{ review.name }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>
        <product-review @review-submitted="addReview"></product-review>



    </div>
    </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            link:"https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inventory:100,
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                variantId: 2234,
                variantColor: 'green',
                variantImage: "./assets/vmSocks-green-onWhite.jpg",
                variantQuantity: 10
                },
                {
                variantId: 2235,
                variantColor: 'blue',
                variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                variantQuantity: 0
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews: []

        }
        },
        methods: { 
            addToCart() {
                this.$emit('add-to-cart',
                this.variants[this.selectedVariant].variantId);                
            },       
            removeFromCart(){
                if (this.cart.length > 0) {
                    this.cart.pop();    
                }
            },
            updateProduct(index) {
                this.selectedVariant = index;
                console.log(index);
            },
            addReview(productReview) {
                this.reviews.push(productReview)
                }
                
        },
        computed: {
            title() {
                return this.brand + ' ' + this.product;
            },
            image() {
                return this.variants[this.selectedVariant].variantImage;
            },
            inStock(){
                return this.variants[this.selectedVariant].variantQuantity
            },
            sale() {
                return this.onSale ? 'Скидка!' : 'Скидки нет';
            },
            shipping() {
                if (this.premium){
                    return "Free";
                } 
                else{
                    return 2.99
                }
            }
                
        }
        
    });

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
        </div>
    `
});


            
let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },

    }
})
        
        
