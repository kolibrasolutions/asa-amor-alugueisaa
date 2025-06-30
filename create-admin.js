const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://phejzxewembqrfqitoiu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZWp6eGV3ZW1icXJmcWl0b2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDIzOTIsImV4cCI6MjA2NTU3ODM5Mn0.m7or70hyjf7LAdx5p514r456KjIjlMlCA2kUCYGbLN8'
);

async function createAdmin() {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'admin@asaamoralugueis.com.br',
      password: 'Admin@123',
      options: {
        data: {
          full_name: 'Administrador Principal'
        }
      }
    });

    if (error) {
      console.error('Erro ao criar administrador:', error.message);
    } else {
      console.log('Administrador criado com sucesso:', data);
    }
  } catch (err) {
    console.error('Erro inesperado:', err);
  }
}

createAdmin(); 