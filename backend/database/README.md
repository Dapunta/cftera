## Step by Step Create MySQL Database

### 1. Table Menu

- Create Table `menu`
    ```sql
    CREATE TABLE menu (
        id_menu VARCHAR(10) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        discount INT DEFAULT 0 NOT NULL,
        category VARCHAR(50) NOT NULL,
        is_available BOOLEAN DEFAULT 1 NOT NULL,
        is_popular BOOLEAN DEFAULT 0 NOT NULL,
        image LONGBLOB
    );
    ```

- Insert All Menu to Table `menu`
    ```sql
    INSERT INTO menu (id_menu, name, price, discount, category, is_available, is_popular, image) VALUES
    ('AYG0000001', 'Ayam Goreng Kremes', 17000, 0, 'ayam', TRUE, TRUE, NULL),
    ('AYB0000002', 'Ayam Bakar Madu', 18000, 0, 'ayam', TRUE, FALSE, NULL),
    ('AYP0000003', 'Ayam Panggang Kecap', 19000, 0, 'ayam', TRUE, FALSE, NULL),
    ('GUL0000004', 'Gulai Ayam Bumbu Merah', 30000, 20, 'ayam', TRUE, FALSE, NULL),
    ('BKG0000001', 'Bebek Goreng Kremes', 25000, 0, 'bebek', TRUE, FALSE, NULL),
    ('BKB0000002', 'Bebek Bakar Kecap', 27000, 0, 'bebek', TRUE, FALSE, NULL),
    ('BKP0000003', 'Bebek Panggang Kecap', 28000, 0, 'bebek', TRUE, FALSE, NULL),
    ('RDG0000001', 'Rendang Khas Minang', 35000, 20, 'sapi', TRUE, FALSE, NULL),
    ('RWN0000002', 'Rawon Khas Surabaya', 40000, 20, 'sapi', TRUE, FALSE, NULL),
    ('STK0000003', 'Steak Sirloin Lada Hitam', 45000, 20, 'sapi', TRUE, FALSE, NULL),
    ('NSG0000001', 'Nasi Goreng Daging Sapi', 24000, 0, 'chinese', TRUE, TRUE, NULL),
    ('KWT0000002', 'Kwetiau Goreng Telur Orak-Arik', 25000, 20, 'chinese', TRUE, TRUE, NULL),
    ('FYH0000003', 'Fu Yung Hai Saus Tomat', 23000, 0, 'chinese', TRUE, FALSE, NULL),
    ('CPY0000004', 'Capcay Saus Tiram', 22000, 0, 'chinese', TRUE, FALSE, NULL),
    ('KPT0000001', 'Kepiting Saus Tiram', 45000, 0, 'seafood', TRUE, FALSE, NULL),
    ('GRM0000002', 'Gurame Bakar Madu', 40000, 0, 'seafood', TRUE, FALSE, NULL),
    ('CMT0000003', 'Cumi Tepung Lada Hitam', 38000, 0, 'seafood', TRUE, FALSE, NULL),
    ('NSP0000001', 'Nasi Putih', 6000, 0, 'nasi', TRUE, FALSE, NULL),
    ('NSU0000002', 'Nasi Uduk', 8000, 0, 'nasi', TRUE, FALSE, NULL),
    ('NSL0000003', 'Nasi Lontong', 5000, 0, 'nasi', TRUE, FALSE, NULL),
    ('ALP0000001', 'Jus Alpukat', 15000, 0, 'jus', TRUE, FALSE, NULL),
    ('STR0000002', 'Jus Stroberi', 20000, 0, 'jus', TRUE, FALSE, NULL),
    ('AGR0000003', 'Jus Anggur', 22000, 0, 'jus', TRUE, FALSE, NULL);
    ```

### 2. Table Pesanan

- Create Table `pesanan`
    ```sql
    CREATE TABLE pesanan (
        id_pesanan VARCHAR(10) NOT NULL PRIMARY KEY,
        time TIMESTAMP NOT NULL,
        status VARCHAR(15) NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        meja VARCHAR(10) NOT NULL,
        ip VARCHAR(10) DEFAULT NULL,
        payment VARCHAR(15) NOT NULL
    );
    ```

### 3. Table Pesanan Menu

- Create Table `pesanan_menu `
    ```sql
    CREATE TABLE pesanan_menu (
        id_pesanan VARCHAR(10),
        id_menu VARCHAR(10),
        count INT NOT NULL DEFAULT 1,
        PRIMARY KEY (id_pesanan, id_menu),
        FOREIGN KEY (id_pesanan) REFERENCES pesanan(id_pesanan)
        ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (id_menu) REFERENCES menu(id_menu)
        ON DELETE CASCADE ON UPDATE CASCADE
    );
    ```

### 4. Table Kasir

- Create Table `kasir`
    ```sql
    CREATE TABLE kasir (
        id_kasir VARCHAR(10) NOT NULL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL
    );
    ```

### 5. Table Kasir Pesanan

- Create Table `kasir_pesanan`
    ```sql
    CREATE TABLE kasir_pesanan (
        id_kasir VARCHAR(10),
        id_pesanan VARCHAR(10),
        time BIGINT NOT NULL,
        PRIMARY KEY (id_kasir, id_pesanan),
        FOREIGN KEY (id_kasir) REFERENCES kasir(id_kasir)
        ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (id_pesanan) REFERENCES pesanan(id_pesanan)
        ON DELETE CASCADE ON UPDATE CASCADE
    );
    ```

- Insert All Menu to Table `kasir_pesanan`
    ```sql
    INSERT INTO kasir (id_kasir, name, username, password, phone, status) VALUES 
    ('DPT0A0A0A1', 'Dapunta Ratya', 'dapunta', 'akusayangkamu', '082227340836', 'Cashier'),
    ('AMR0A0A0A1', 'Ammar Ghozy', 'ammar', 'ammar123', '082212344321', 'Cashier');
    ```