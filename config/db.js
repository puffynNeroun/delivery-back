require('dotenv').config(); // Загружаем .env

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("Ошибка: отсутствуют ключи Supabase");
    process.exit(1);
}

// Создаём клиент Supabase с Service Role Key
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false }
});

console.log("🔗 Подключение к Supabase успешно");

module.exports = { supabase };
