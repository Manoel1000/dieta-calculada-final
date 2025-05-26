
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const supabaseUrl = 'https://SEU_SUPABASE_URL.supabase.co';
const supabaseKey = 'SUA_CHAVE_PUBLICA_ANON';
const supabase = createClient(supabaseUrl, supabaseKey);

// Cadastro
app.post('/api/register', async (req, res) => {
  const { email, password, name } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  await supabase.from('users').insert({ id: data.user.id, name, email });
  res.json({ message: 'Usuário registrado com sucesso' });
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(401).json({ error: error.message });
  res.json({ token: data.session.access_token, user: data.user });
});

// Gerar dieta e salvar
app.post('/api/generate-diet', async (req, res) => {
  const { token, age, weight, height, goal, selectedFoods } = req.body;
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);
  if (userError) return res.status(401).json({ error: "Token inválido" });

  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  const calories = goal === 'Ganho de Massa' ? bmr + 500 : bmr - 500;
  const plan = selectedFoods.map(food => ({
    food,
    grams: Math.round(calories / selectedFoods.length / 2)
  }));

  await supabase.from('diet_plans').insert({ user_id: user.id, foods: plan });
  res.json({ plan });
});

// Listar dietas do usuário
app.post('/api/my-diets', async (req, res) => {
  const { token } = req.body;
  const { data: { user } } = await supabase.auth.getUser(token);
  const { data, error } = await supabase.from('diet_plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.listen(5000, () => {
  console.log('🔥 API com Supabase rodando na porta 5000');
});
