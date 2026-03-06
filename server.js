const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

const DATA_FILE = path.join(__dirname, '..', 'inimigos.json');
const ALIADOS_FILE = path.join(__dirname, '..', 'aliados.json');
const EQUIPAMENTOS_FILE = path.join(__dirname, '..', 'equipamentos.json');
const VEICULOS_FILE = path.join(__dirname, '..', 'veiculos.json');
const CONTATOS_FILE = path.join(__dirname, '..', 'contatos.json');
const SERVICOS_FILE = path.join(__dirname, '..', 'servicos.json');
const NOTICIAS_FILE = path.join(__dirname, '..', 'noticias.json');

app.use(cors());
app.use(express.json({limit: '10mb'})); // Para lidar com JSON de até 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Servir pastas corretamente
app.use('/Style', express.static(path.join(__dirname, '..', 'Style')));
app.use('/Script', express.static(path.join(__dirname)));
app.use('/Templates', express.static(path.join(__dirname, '..', 'Templates')));
app.use('/Image', express.static(path.join(__dirname, '..', 'Image')));
app.use('/Fonte', express.static(path.join(__dirname, '..', 'Fonte')));

// Rota principal abrindo paginaInicial.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Templates', 'paginaInicial.html'));
});

// Funções de dados para inimigos
function lerInimigos() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(DATA_FILE));
}
function salvarInimigos(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Funções de dados para aliados
function lerAliados() {
    if (!fs.existsSync(ALIADOS_FILE)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(ALIADOS_FILE));
}
function salvarAliados(data) {
    fs.writeFileSync(ALIADOS_FILE, JSON.stringify(data, null, 2));
}

//Funções de dados para equipamentos
function lerEquipamentos() {
    if (!fs.existsSync(EQUIPAMENTOS_FILE)) {
        return [];
    }
    try {
        const dados = fs.readFileSync(EQUIPAMENTOS_FILE);
        return JSON.parse(dados);
    } catch (error) {
        console.error('Erro ao ler equipamentos:', error);
        return [];
    }
}
function salvarEquipamentos(data) {
    fs.writeFileSync(EQUIPAMENTOS_FILE, JSON.stringify(data, null, 2));
}

//Funções de dados para veículos
function lerVeiculos() {
    if (!fs.existsSync(VEICULOS_FILE)) {
        return [];
    }
    try {
        const dados = fs.readFileSync(VEICULOS_FILE);
        return JSON.parse(dados);
    } catch (error) {
        console.error('Erro ao ler veículos:', error);
        return [];
    }
}
function salvarVeiculos(data) {
    fs.writeFileSync(VEICULOS_FILE, JSON.stringify(data, null, 2));
}

//Funções de dados para contatos
function lerContato() {
    if (!fs.existsSync(CONTATOS_FILE)) {
        // Criar arquivo padrão se não existir
        const contatoPadrao = { telefone: "", email: "", endereco: "" };
        fs.writeFileSync(CONTATOS_FILE, JSON.stringify(contatoPadrao, null, 2));
        return contatoPadrao;
    }
    try {
        const dados = fs.readFileSync(CONTATOS_FILE);
        return JSON.parse(dados);
    } catch (error) {
        console.error('Erro ao ler contato:', error);
        return { telefone: "", email: "", endereco: "" };
    }
}

function salvarContato(data) {
    fs.writeFileSync(CONTATOS_FILE, JSON.stringify(data, null, 2));
}

//Funções de dados para serviços
function lerServicos() {
    if (!fs.existsSync(SERVICOS_FILE)) {
        return [];
    }
    try {
        const dados = fs.readFileSync(SERVICOS_FILE);
        return JSON.parse(dados);
    } catch (error) {
        console.error('Erro ao ler serviços:', error);
        return [];
    }
}
function salvarServicos(data) {
    fs.writeFileSync(SERVICOS_FILE, JSON.stringify(data, null, 2));
}

//Funções de dados para noticias
function lerNoticias() {
    if (!fs.existsSync(NOTICIAS_FILE)) {
        return [];
    }
    try {
        const dados = fs.readFileSync(NOTICIAS_FILE);
        return JSON.parse(dados);
    } catch (error) {
        console.error('Erro ao ler noticias:', error);
        return [];
    }
}
function salvarNoticias(data) {
    fs.writeFileSync(NOTICIAS_FILE, JSON.stringify(data, null, 2));
}




// ########## Rotas API ##########

// ========== Inimigos ==========

app.get('/api/inimigos', (req, res) => {
    res.json(lerInimigos());
});
app.post('/api/inimigos', (req, res) => {
    salvarInimigos(req.body);
    res.json({ mensagem: 'Salvo com sucesso' });
});

// ========== Aliados ==========

app.get('/api/aliados', (req, res) => {
    res.json(lerAliados());
});
app.post('/api/aliados', (req, res) => {
    salvarAliados(req.body);
    res.json({ mensagem: 'Salvo com sucesso' });
});

// ========== Equipamentos ==========

app.get('/api/equipamentos', (req, res) => {
    res.json(lerEquipamentos());
});

app.get('/api/equipamentos/:id', (req, res) => {
    const equipamentos = lerEquipamentos();
    const idParam = req.params.id;
    const equipamento = equipamentos.find(e => e.id == idParam || e.id === parseInt(idParam) || e.id === idParam.toString());
    if (equipamento) {
        res.json(equipamento);
    } else {
        res.status(404).json({ erro: 'Equipamento não encontrado' });
    }
});

app.post('/api/equipamentos', (req, res) => {
    let equipamentos = lerEquipamentos();
    const novoEquipamento = req.body;
    
    // Verificar se é um array ou objeto único
    if (Array.isArray(req.body)) {
        // Se for array, substitui completamente
        salvarEquipamentos(req.body);
        res.json({ mensagem: 'Equipamentos salvos com sucesso', quantidade: req.body.length });
    } else {
        // Se for objeto único, adiciona à lista
        // Gerar ID se não existir
        if (!novoEquipamento.id) {
            novoEquipamento.id = Date.now().toLocaleString();
        }
        
        equipamentos.push(novoEquipamento);
        salvarEquipamentos(equipamentos);
        res.json({ mensagem: 'Equipamento salvo com sucesso', id: novoEquipamento.id });
    }
});

app.put('/api/equipamentos/:id', (req, res) => {
    const equipamentos = lerEquipamentos();
    const index = equipamentos.findIndex(e => e.id == req.params.id);
    
    if (index !== -1) {
        equipamentos[index] = { ...req.body, id: parseInt(req.params.id) };
        salvarEquipamentos(equipamentos);
        res.json({ mensagem: 'Equipamento atualizado com sucesso' });
    } else {
        res.status(404).json({ erro: 'Equipamento não encontrado' });
    }
});

app.delete('/api/equipamentos/:id', (req, res) => {
    const equipamentos = lerEquipamentos();
    const novosEquipamentos = equipamentos.filter(e => e.id != req.params.id);
    
    if (novosEquipamentos.length < equipamentos.length) {
        salvarEquipamentos(novosEquipamentos);
        res.json({ mensagem: 'Equipamento excluído com sucesso' });
    } else {
        res.status(404).json({ erro: 'Equipamento não encontrado' });
    }
});

// ========== Veiculos ==========

app.get('/api/veiculos', (req, res) => {
    res.json(lerVeiculos());
});

app.get('/api/veiculos/:id', (req, res) => {
    const veiculos = lerVeiculos();
    const idParam = req.params.id;
    const veiculo = veiculos.find(e => e.id == idParam || e.id === parseInt(idParam) || e.id === idParam.toString());
    if (veiculo) {
        res.json(veiculo);
    } else {
        res.status(404).json({ erro: 'Veículo não encontrado' });
    }
});

app.post('/api/veiculos', (req, res) => {
    let veiculos = lerVeiculos();
    const novoVeiculo = req.body;
    
    // Verificar se é um array ou objeto único
    if (Array.isArray(req.body)) {
        // Se for array, substitui completamente
        salvarVeiculos(req.body);
        res.json({ mensagem: 'Veículos salvos com sucesso', quantidade: req.body.length });
    } else {
        // Se for objeto único, adiciona à lista
        // Gerar ID se não existir
        if (!novoVeiculo.id) {
            novoVeiculo.id = Date.now().toLocaleString();
        }
        
        veiculos.push(novoVeiculo);
        salvarVeiculos(veiculos);
        res.json({ mensagem: 'Veículo salvo com sucesso', id: novoVeiculo.id });
    }
});

app.put('/api/veiculos/:id', (req, res) => {
    const veiculos = lerVeiculos();
    const index = veiculos.findIndex(e => e.id == req.params.id);
    
    if (index !== -1) {
        veiculos[index] = { ...req.body, id: parseInt(req.params.id) };
        salvarVeiculos(veiculos);
        res.json({ mensagem: 'Veículo atualizado com sucesso' });
    } else {
        res.status(404).json({ erro: 'Veículo não encontrado' });
    }
});

app.delete('/api/veiculos/:id', (req, res) => {
    const veiculos = lerVeiculos();
    const novosVeiculos = veiculos.filter(e => e.id != req.params.id);
    
    if (novosVeiculos.length < veiculos.length) {
        salvarVeiculos(novosVeiculos);
        res.json({ mensagem: 'Veículo excluído com sucesso' });
    } else {
        res.status(404).json({ erro: 'Veículo não encontrado' });
    }
});

// ========== Contatos ==========
app.get('/api/contato', (req, res) => {
    const contato = lerContato();
    res.json(contato);
});
app.post('/api/contato', (req, res) => {
    const { telefone, email, endereco } = req.body;
    
    // Validar se os dados foram enviados
    if (telefone === undefined || email === undefined || endereco === undefined) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }
    
    const contato = { telefone, email, endereco };
    salvarContato(contato);
    console.log('Contato salvo:', contato);
    res.json({ mensagem: 'Contato salvo com sucesso' });
});
app.put('/api/contato', (req, res) => {
    const { telefone, email, endereco } = req.body;
    
    if (telefone === undefined || email === undefined || endereco === undefined) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }
    
    const contato = { telefone, email, endereco };
    salvarContato(contato);
    console.log('Contato atualizado:', contato);
    res.json({ mensagem: 'Contato atualizado com sucesso' });
});


// ========== Serviços ==========
app.get('/api/servicos', (req, res) => {
    res.json(lerServicos());
});

app.get('/api/servicos/:id', (req, res) => {
    const servicos = lerServicos();
    const idParam = req.params.id;
    const servico = servicos.find(s => s.id == idParam || s.id === parseInt(idParam) || s.id === idParam.toString());
    if (servico) {
        res.json(servico);
    } else {
        res.status(404).json({ erro: 'Serviço não encontrado' });
    }
});

app.post('/api/servicos', (req, res) => {
    let servicos = lerServicos();
    const novoServico = req.body;
    
    // Verificar se é um array ou objeto único
    if (Array.isArray(req.body)) {
        // Se for array, substitui completamente
        salvarServicos(req.body);
        res.json({ mensagem: 'Serviços salvos com sucesso', quantidade: req.body.length });
    } else {
        // Se for objeto único, adiciona à lista
        // Gerar ID se não existir
        if (!novoServico.id) {
            novoServico.id = Date.now().toString();
        }
        
        servicos.push(novoServico);
        salvarServicos(servicos);
        res.json({ mensagem: 'Serviço salvo com sucesso', id: novoServico.id });
    }
});

app.put('/api/servicos/:id', (req, res) => {
    const servicos = lerServicos();
    const index = servicos.findIndex(s => s.id == req.params.id);
    
    if (index !== -1) {
        servicos[index] = { ...req.body, id: req.params.id };
        salvarServicos(servicos);
        res.json({ mensagem: 'Serviço atualizado com sucesso' });
    } else {
        res.status(404).json({ erro: 'Serviço não encontrado' });
    }
});

app.delete('/api/servicos/:id', (req, res) => {
    const servicos = lerServicos();
    const novosServicos = servicos.filter(s => s.id != req.params.id);
    
    if (novosServicos.length < servicos.length) {
        salvarServicos(novosServicos);
        res.json({ mensagem: 'Serviço excluído com sucesso' });
    } else {
        res.status(404).json({ erro: 'Serviço não encontrado' });
    }
});

// ========== Noticias ==========
app.get('/api/noticias', (req, res) => {
    res.json(lerNoticias());
});

app.get('/api/noticias/:id', (req, res) => {
    const noticias = lerNoticias();
    const idParam = req.params.id;
    const noticia = noticias.find(s => s.id == idParam || s.id === parseInt(idParam) || s.id === idParam.toString());
    if (noticia) {
        res.json(noticia);
    } else {
        res.status(404).json({ erro: 'Notícia não encontrada' });
    }
});

app.post('/api/noticias', (req, res) => {
    let noticias = lerNoticias();
    const novaNoticia = req.body;
    
    // Verificar se é um array ou objeto único
    if (Array.isArray(req.body)) {
        // Se for array, substitui completamente
        salvarNoticias(req.body);
        res.json({ mensagem: 'Notícias salvas com sucesso', quantidade: req.body.length });
    } else {
        // Se for objeto único, adiciona à lista
        // Gerar ID se não existir
        if (!novaNoticia.id) {
            novaNoticia.id = Date.now().toString();
        }
        
        noticias.push(novaNoticia);
        salvarNoticias(noticias);
        res.json({ mensagem: 'Notícia salva com sucesso', id: novaNoticia.id });
    }
});

app.put('/api/noticias/:id', (req, res) => {
    const noticias = lerNoticias();
    const index = noticias.findIndex(s => s.id == req.params.id);
    
    if (index !== -1) {
        noticias[index] = { ...req.body, id: req.params.id };
        salvarNoticias(noticias);
        res.json({ mensagem: 'Notícia atualizada com sucesso' });
    } else {
        res.status(404).json({ erro: 'Notícia não encontrada' });
    }
});

app.delete('/api/noticias/:id', (req, res) => {
    const noticias = lerNoticias();
    const novasNoticias = noticias.filter(s => s.id != req.params.id);
    
    if (novasNoticias.length < noticias.length) {
        salvarNoticias(novasNoticias);
        res.json({ mensagem: 'Notícia excluída com sucesso' });
    } else {
        res.status(404).json({ erro: 'Notícia não encontrada' });
    }
});



app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

