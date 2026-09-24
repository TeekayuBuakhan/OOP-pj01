// ประกาศให้ TypeScript รู้จักตัวแปร Swal ที่มาจาก CDN
declare const Swal: any;

// ห่อหุ้มโค้ดด้วย IIFE (Immediately Invoked Function Expression) 
// เพื่อป้องกันปัญหา TS มองเห็นตัวแปรชนกับไฟล์ app.js (Cannot redeclare block-scoped variable)
(() => {
    // ==========================================================
    // 1. Abstraction & 2. Encapsulation
    // ==========================================================
    abstract class Ingredient {
        protected name: string;
        private price: number;

        constructor(name: string, price: number) {
            this.name = name;
            this.price = price;
        }

        public getPrice(): number {
            return this.price;
        }

        public getName(): string {
            return this.name;
        }

        abstract getDetails(): string;
    }

    // ==========================================================
    // 3. Inheritance & 4. Polymorphism
    // ==========================================================
    class Base extends Ingredient {
        private type: string;

        constructor(name: string, price: number, type: string) {
            super(name, price);
            this.type = type;
        }

        public getDetails(): string {
            return `ฐาน: ${this.getName()} (เนื้อ ${this.type}) - ${this.getPrice()} บาท`;
        }
    }

    class Cream extends Ingredient {
        private flavor: string;

        constructor(name: string, price: number, flavor: string) {
            super(name, price);
            this.flavor = flavor;
        }

        public getDetails(): string {
            return `ครีม: ${this.getName()} (รส ${this.flavor}) - ${this.getPrice()} บาท`;
        }
    }

    class Topping extends Ingredient {
        private isPremium: boolean;

        constructor(name: string, price: number, isPremium: boolean = false) {
            super(name, price);
            this.isPremium = isPremium;
        }

        public getDetails(): string {
            const tag = this.isPremium ? "[พรีเมียม]" : "";
            return `ท็อปปิ้ง: ${this.getName()} ${tag} - ${this.getPrice()} บาท`;
        }
    }

    // ==========================================================
    // คลาสสำหรับจัดการคำสั่งซื้อ (Domain Models)
    // ==========================================================
    class Cake {
        private base: Base | null = null;
        private cream: Cream | null = null;
        private toppings: Topping[] = [];

        public setBase(base: Base): void { this.base = base; }
        public setCream(cream: Cream): void { this.cream = cream; }
        public addTopping(topping: Topping): void { this.toppings.push(topping); }

        public calculatePrice(): number {
            let total = 0;
            if (this.base) total += this.base.getPrice();
            if (this.cream) total += this.cream.getPrice();
            for (const topping of this.toppings) {
                total += topping.getPrice();
            }
            return total;
        }

        public getDetails(): string[] {
            const items: string[] = [];
            if (this.base) items.push(this.base.getDetails());
            if (this.cream) items.push(this.cream.getDetails());
            this.toppings.forEach(t => items.push(t.getDetails()));
            return items;
        }
    }

    class Order {
        private id: number;
        private cake: Cake;
        private createdAt: Date;

        constructor(id: number, cake: Cake) {
            this.id = id;
            this.cake = cake;
            this.createdAt = new Date();
        }

        public getId(): number { return this.id; }
        public getCake(): Cake { return this.cake; }
        public getOrderTotal(): number { return this.cake.calculatePrice(); }
        public getFormattedTime(): string {
            return this.createdAt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
        }
    }

    class OrderManager {
        private orders: Order[] = [];
        private nextId: number = 1;

        public createOrder(cake: Cake): Order {
            const order = new Order(this.nextId++, cake);
            this.orders.push(order);
            return order;
        }

        public completeOrder(id: number): boolean {
            const index = this.orders.findIndex(o => o.getId() === id);
            if (index !== -1) {
                this.orders.splice(index, 1);
                return true;
            }
            return false;
        }

        public getOrders(): Order[] { return this.orders; }
        
        public calculateGrandTotal(): number {
            return this.orders.reduce((sum, order) => sum + order.getOrderTotal(), 0);
        }
        
        public getTotalCount(): number {
            return this.orders.length;
        }
    }

    // ==========================================================
    // ส่วนควบคุม GUI
    // ==========================================================
    const manager = new OrderManager();

    // เปลี่ยนมาดึง Element แบบปลอดภัยเพื่อไม่ให้ TS แจ้งเตือนเรื่อง Null
    const addOrderBtn = document.getElementById('addOrderBtn') as HTMLButtonElement | null;
    const orderList = document.getElementById('orderList') as HTMLDivElement | null;
    const grandTotalPriceEl = document.getElementById('grandTotalPrice') as HTMLElement | null;
    const totalOrdersCountEl = document.getElementById('totalOrdersCount') as HTMLElement | null;

    function assembleCakeFromForm(): Cake {
        const cake = new Cake();

        const baseSelect = document.getElementById('baseSelect') as HTMLSelectElement | null;
        const creamSelect = document.getElementById('creamSelect') as HTMLSelectElement | null;
        
        if (baseSelect) {
            const baseVal = baseSelect.value;
            if (baseVal === 'sponge') cake.setBase(new Base("เค้กสปอนจ์", 100, "Sponge"));
            if (baseVal === 'moose') cake.setBase(new Base("เค้กมูส", 120, "Mousse"));
            if (baseVal === 'crape') cake.setBase(new Base("เค้กเคร์ป", 120, "Crepes"));
            if (baseVal === 'cheesecake') cake.setBase(new Base("เค้กชีสเค้ก", 120, "Cheesecake"));
        }

        if (creamSelect) {
            const creamVal = creamSelect.value;
            if (creamVal === 'milk') cake.setCream(new Cream("นมสด", 50, "Sweet"));
            if (creamVal === 'matcha') cake.setCream(new Cream("ชาเขียว", 60, "Earthy"));
            if (creamVal === 'strawberry') cake.setCream(new Cream("สตรอว์เบอร์รี", 60, "Fruity"));
            if (creamVal === 'chocolate') cake.setCream(new Cream("ช็อกโกแลต", 60, "Rich"));
            if (creamVal === 'orange') cake.setCream(new Cream("ส้ม", 60, "Citrus"));
            if (creamVal === 'lemon') cake.setCream(new Cream("เลมอน", 60, "Citrus"));
            if (creamVal === 'chocomint') cake.setCream(new Cream("ช็อกโกแลตมินต์", 60, "Minty"));
            if (creamVal === 'coconut') cake.setCream(new Cream("มะพร้าว", 60, "Tropical"));
            if (creamVal === 'caramel') cake.setCream(new Cream("คาราเมล", 60, "Caramel"));
            if (creamVal === 'coffee') cake.setCream(new Cream("กาแฟ", 60, "Earthy"));
        }

        const topStrawberry = document.getElementById('topStrawberry') as HTMLInputElement | null;
        const topBrownie = document.getElementById('topBrownie') as HTMLInputElement | null;
        const topKitKat = document.getElementById('topKitKat') as HTMLInputElement | null;
        const topOreo = document.getElementById('topOreo') as HTMLInputElement | null;

        if (topStrawberry?.checked) cake.addTopping(new Topping("สตรอว์เบอร์รี", 30, false));
        if (topBrownie?.checked) cake.addTopping(new Topping("บราวนี่", 40, true));
        if (topKitKat?.checked) cake.addTopping(new Topping("คิตแคต", 50, true));
        if (topOreo?.checked) cake.addTopping(new Topping("โอริโอ้", 40, true));

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

    function renderOrderList(): void {
        if (!orderList) return; // ป้องกัน Error ถ้าหา orderList ไม่เจอ
        
        const orders = manager.getOrders();
        orderList.innerHTML = '';

        if (orders.length === 0) {
            orderList.innerHTML = '<p id="emptyState" class="text-gray-400 text-center py-4">ยังไม่มีรายการสั่งซื้อ</p>';
        } else {
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

                const completeBtn = card.querySelector('.complete-btn') as HTMLButtonElement | null;
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
                        }).then((result: any) => {
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

        if (grandTotalPriceEl) grandTotalPriceEl.textContent = manager.calculateGrandTotal().toString();
        if (totalOrdersCountEl) totalOrdersCountEl.textContent = manager.getTotalCount().toString(); 
    }
})();