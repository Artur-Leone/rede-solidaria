import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Suíte de Testes da API Sombrinha', () => {
  it('1. GET /api/health deve responder status 200 com informações de saúde e clima da RMR', async () => {
    const res = await request(app).get('/api/health');
    
    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.status).toBe('online');
    expect(res.body.climaAtualRMR).toBeDefined();
    expect(res.body.climaAtualRMR.alertaAtivo).toBe(true);
  });

  it('2. GET /api/pontos deve retornar a lista de pontos de sombra e bebedouros de Recife', async () => {
    const res = await request(app).get('/api/pontos');

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(Array.isArray(res.body.dados)).toBe(true);
    expect(res.body.dados.length).toBeGreaterThan(0);
    
    // Verifica campos de cada ponto
    const primeiroPonto = res.body.dados[0];
    expect(primeiroPonto).toHaveProperty('id');
    expect(primeiroPonto).toHaveProperty('nome');
    expect(primeiroPonto).toHaveProperty('tipo');
    expect(primeiroPonto).toHaveProperty('latitude');
    expect(primeiroPonto).toHaveProperty('longitude');
  });

  it('3. POST /api/rotas/sombra deve sugerir trajeto fresco com alívio térmico', async () => {
    const res = await request(app)
      .post('/api/rotas/sombra')
      .send({ origem: 'Derby', destino: 'Marco Zero' });

    expect(res.status).toBe(200);
    expect(res.body.sucesso).toBe(true);
    expect(res.body.dados.rotaSugerida).toBeDefined();
    expect(res.body.dados.rotaSugerida.tipo).toBe('SOMBRINHA_ARBORIZADA');
    expect(res.body.dados.rotaSugerida.indiceSombra).toContain('coberto');
  });

  it('4. GET /api/rota-inexistente deve retornar erro 404 em formato JSON padronizado', async () => {
    const res = await request(app).get('/api/rota-que-nao-existe-xyz');

    expect(res.status).toBe(404);
    expect(res.body.sucesso).toBe(false);
    expect(res.body.erro).toBeDefined();
    expect(res.body.erro.status).toBe(404);
    expect(res.body.erro.mensagem).toContain('Rota não encontrada');
  });
});
