"use strict";
// ห่อหุ้มโค้ดด้วย IIFE (Immediately Invoked Function Expression) 
// เพื่อป้องกันปัญหา TS มองเห็นตัวแปรชนกับไฟล์ app.js (Cannot redeclare block-scoped variable)
(() => {
    // ==========================================================
    // 1. Abstraction & 2. Encapsulation
    // ==========================================================
    class Ingredient {
        name;
        price;
        constructor(name, price) {
            this.name = name;
            this.price = price;
        }
        getPrice() {
            return this.price;
        }
        getName() {
            return this.name;
        }
    }
    // ==========================================================
    // 3. Inheritance & 4. Polymorphism
    // ==========================================================
    class Base extends Ingredient {
        type;
        constructor(name, price, type) {
            super(name, price);
            this.type = type;
        }
        getDetails() {
            return `ฐาน: ${this.getName()} (เนื้อ ${this.type}) - ${this.getPrice()} บาท`;
        }
    }
    class Cream extends Ingredient {
        flavor;
        constructor(name, price, flavor) {
            super(name, price);
            this.flavor = flavor;
        }
        getDetails() {
            return `ครีม: ${this.getName()} (รส ${this.flavor}) - ${this.getPrice()} บาท`;
        }
    }
    class Topping extends Ingredient {
        isPremium;
        constructor(name, price, isPremium = false) {
            super(name, price);
            this.isPremium = isPremium;
        }
        getDetails() {
            const tag = this.isPremium ? "[พรีเมียม]" : "";
            return `ท็อปปิ้ง: ${this.getName()} ${tag} - ${this.getPrice()} บาท`;
        }
    }
    // ==========================================================
    // คลาสสำหรับจัดการคำสั่งซื้อ (Domain Models)
    // ==========================================================
    class Cake {
        base = null;
        cream = null;
        toppings = [];
        setBase(base) { this.base = base; }
        setCream(cream) { this.cream = cream; }
        addTopping(topping) { this.toppings.push(topping); }
        calculatePrice() {
            let total = 0;
            if (this.base)
                total += this.base.getPrice();
            if (this.cream)
                total += this.cream.getPrice();
            for (const topping of this.toppings) {
                total += topping.getPrice();
            }
            return total;
        }
        getDetails() {
            const items = [];
            if (this.base)
                items.push(this.base.getDetails());
            if (this.cream)
                items.push(this.cream.getDetails());
            this.toppings.forEach(t => items.push(t.getDetails()));
            return items;
        }
    }
    class Order {
        id;
        cake;
        createdAt;
        constructor(id, cake) {
            this.id = id;
            this.cake = cake;
            this.createdAt = new Date();
        }
        getId() { return this.id; }
        getCake() { return this.cake; }
        getOrderTotal() { return this.cake.calculatePrice(); }
        getFormattedTime() {
            return this.createdAt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        }
    }
    class OrderManager {
        orders = [];
        nextId = 1;
        createOrder(cake) {
            const order = new Order(this.nextId++, cake);
            this.orders.push(order);
            return order;
        }
        completeOrder(id) {
            const index = this.orders.findIndex(o => o.getId() === id);
            if (index !== -1) {
                this.orders.splice(index, 1);
                return true;
            }
            return false;
        }
        getOrders() { return this.orders; }
        calculateGrandTotal() {
            return this.orders.reduce((sum, order) => sum + order.getOrderTotal(), 0);
        }
        getTotalCount() {
            return this.orders.length;
        }
    }
    // ==========================================================
    // ส่วนควบคุม GUI
    // ==========================================================
    const manager = new OrderManager();
    // เปลี่ยนมาดึง Element แบบปลอดภัยเพื่อไม่ให้ TS แจ้งเตือนเรื่อง Null
    const addOrderBtn = document.getElementById('addOrderBtn');
    const orderList = document.getElementById('orderList');
    const grandTotalPriceEl = document.getElementById('grandTotalPrice');
    const totalOrdersCountEl = document.getElementById('totalOrdersCount');
    function assembleCakeFromForm() {
        const cake = new Cake();
        const baseSelect = document.getElementById('baseSelect');
        const creamSelect = document.getElementById('creamSelect');
        if (baseSelect) {
            const baseVal = baseSelect.value;
            if (baseVal === 'sponge')
                cake.setBase(new Base("เค้กสปอนจ์", 100, "Sponge"));
            if (baseVal === 'moose')
                cake.setBase(new Base("เค้กมูส", 120, "Mousse"));
            if (baseVal === 'crape')
                cake.setBase(new Base("เค้กเคร์ป", 120, "Crepes"));
            if (baseVal === 'cheesecake')
                cake.setBase(new Base("เค้กชีสเค้ก", 120, "Cheesecake"));
        }
        if (creamSelect) {
            const creamVal = creamSelect.value;
            if (creamVal === 'milk')
                cake.setCream(new Cream("นมสด", 50, "Sweet"));
            if (creamVal === 'matcha')
                cake.setCream(new Cream("ชาเขียว", 60, "Earthy"));
            if (creamVal === 'strawberry')
                cake.setCream(new Cream("สตรอว์เบอร์รี", 60, "Fruity"));
            if (creamVal === 'chocolate')
                cake.setCream(new Cream("ช็อกโกแลต", 60, "Rich"));
            if (creamVal === 'orange')
                cake.setCream(new Cream("ส้ม", 60, "Citrus"));
            if (creamVal === 'lemon')
                cake.setCream(new Cream("เลมอน", 60, "Citrus"));
            if (creamVal === 'chocomint')
                cake.setCream(new Cream("ช็อกโกแลตมินต์", 60, "Minty"));
            if (creamVal === 'coconut')
                cake.setCream(new Cream("มะพร้าว", 60, "Tropical"));
            if (creamVal === 'caramel')
                cake.setCream(new Cream("คาราเมล", 60, "Caramel"));
            if (creamVal === 'coffee')
                cake.setCream(new Cream("กาแฟ", 60, "Earthy"));
        }
        const topStrawberry = document.getElementById('topStrawberry');
        const topBrownie = document.getElementById('topBrownie');
        const topKitKat = document.getElementById('topKitKat');
        const topOreo = document.getElementById('topOreo');
        if (topStrawberry?.checked)
            cake.addTopping(new Topping("สตรอว์เบอร์รี", 30, false));
        if (topBrownie?.checked)
            cake.addTopping(new Topping("บราวนี่", 40, true));
        if (topKitKat?.checked)
            cake.addTopping(new Topping("คิตแคต", 50, true));
        if (topOreo?.checked)
            cake.addTopping(new Topping("โอริโอ้", 40, true));
        return cake;
    }
    if (addOrderBtn) {
        addOrderBtn.addEventListener('click', () => {
            const cake = assembleCakeFromForm();
            manager.createOrder(cake);
            renderOrderList();
            setTimeout(() => {
                if (orderList) {
                    orderList.scrollTop = orderList.scrollHeight;
                }
            }, 50);
        });
    }
    function renderOrderList() {
        if (!orderList)
            return; // ป้องกัน Error ถ้าหา orderList ไม่เจอ
        const orders = manager.getOrders();
        orderList.innerHTML = '';
        if (orders.length === 0) {
            orderList.innerHTML = '<p id="emptyState" class="text-gray-400 text-center py-4">ยังไม่มีรายการสั่งซื้อ</p>';
        }
        else {
            orders.forEach(order => {
                const card = document.createElement('div');
                card.className = "border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex flex-col md:flex-row justify-between gap-4";
                const cakeDetails = order.getCake().getDetails().map(d => `<li class="text-sm text-gray-600">${d}</li>`).join('');
                card.innerHTML = `
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <span class="bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded text-sm">
                                ออเดอร์ #${order.getId()}
                            </span>
                            <span class="text-xs text-gray-400">เวลา ${order.getFormattedTime()} น.</span>
                        </div>
                        <ul class="list-disc pl-5 mb-2">
                            ${cakeDetails}
                        </ul>
                        <p class="text-base font-bold text-gray-800">
                            ราคารวมออเดอร์นี้: <span class="text-blue-600">${order.getOrderTotal()}</span> บาท
                        </p>
                    </div>
                    <div class="flex items-end md:items-center">
                        <button class="complete-btn w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition"
                                data-id="${order.getId()}">
                            ✓ เสร็จสิ้นออเดอร์
                        </button>
                    </div>
                `;
                const completeBtn = card.querySelector('.complete-btn');
                if (completeBtn) {
                    completeBtn.addEventListener('click', () => {
                        Swal.fire({
                            title: 'ยืนยันการเสร็จสิ้นออเดอร์',
                            text: `คุณต้องการยืนยันว่า ออเดอร์ #${order.getId()} เสร็จสิ้นแล้วใช่หรือไม่?`,
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#28a745',
                            cancelButtonColor: '#d33',
                            confirmButtonText: 'ยืนยัน',
                            cancelButtonText: 'ยกเลิก'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                manager.completeOrder(order.getId());
                                renderOrderList();
                            }
                        });
                    });
                }
                orderList.appendChild(card);
            });
        }
        if (grandTotalPriceEl)
            grandTotalPriceEl.textContent = manager.calculateGrandTotal().toString();
        if (totalOrdersCountEl)
            totalOrdersCountEl.textContent = manager.getTotalCount().toString();
    }
})();
