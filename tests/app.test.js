const assert = require('node:assert/strict');
const {
  DEFAULTS,
  calculateActiveBatch,
  calculatePremixBulk,
  isPremixValid
} = require('../app.js');

console.log('Iniciando batería de pruebas unitarias para La Receta de Don Cangrejo...');

// 1. Verificación de fórmulas para 20 kg (Receta Actual)
{
  const batch = calculateActiveBatch(20, 'cagada', DEFAULTS.premix, DEFAULTS.precios);
  
  assert.equal(batch.meatKg, 20);
  assert.equal(batch.phase1.totalPremixG, 340); // 20 * 17 g/kg
  assert.equal(batch.phase1.salG, 289); // 340 * 0.85
  assert.equal(batch.phase1.salCuraG, 13.6); // 340 * 0.04
  assert.equal(batch.phase1.azucarG, 37.4); // 340 * 0.11

  assert.equal(batch.phase2.guajilloG, 300); // 20 * 1.5%
  assert.equal(batch.phase2.pimentonG, 80); // 20 * 0.4%
  assert.equal(batch.phase2.especiasG, 120); // 20 * 0.6%
  assert.equal(batch.phase2.ajoG, 120); // 20 * 0.6% -> Exactamente 120 g por 20 kg
  assert.equal(batch.phase2.aguaMl, 1000); // 20 * 5%

  assert.ok(batch.masaFinalKg > 21.0);
  assert.ok(batch.costs.total > 1000);
  assert.ok(batch.metrics.utilityPerKg > 0);
  console.log('✓ Prueba 20 kg (Receta Actual) aprobada con éxito.');
}

// 2. Verificación de fórmulas para 60 kg (Receta Actual)
{
  const batch = calculateActiveBatch(60, 'cagada', DEFAULTS.premix, DEFAULTS.precios);

  assert.equal(batch.phase1.totalPremixG, 1020);
  assert.equal(batch.phase2.guajilloG, 900);
  assert.equal(batch.phase2.pimentonG, 240);
  assert.equal(batch.phase2.especiasG, 360);
  assert.equal(batch.phase2.ajoG, 360);
  assert.equal(batch.phase2.aguaMl, 3000);
  console.log('✓ Prueba 60 kg (Receta Actual) aprobada con éxito.');
}

// 3. Verificación de Receta del Viejo (Alternativa)
{
  const batch = calculateActiveBatch(20, 'viejo', DEFAULTS.premix, DEFAULTS.precios);

  assert.equal(batch.phase2.guajilloG, 300);
  assert.equal(batch.phase2.pimentonG, 40); // 0.2%
  assert.equal(batch.phase2.especiasG, 80); // 0.4%
  assert.equal(batch.phase2.ajoG, 100); // 0.5%
  console.log('✓ Prueba Receta del Viejo aprobada con éxito.');
}

// 4. Verificación de Laboratorio de Premix
{
  assert.ok(isPremixValid(85, 4, 11));
  assert.ok(!isPremixValid(85, 5, 11));

  const bulk1kg = calculatePremixBulk(1, DEFAULTS.premix);
  assert.equal(bulk1kg.salG, 850);
  assert.equal(bulk1kg.curaG, 40);
  assert.equal(bulk1kg.azucarG, 110);

  const bulk5kg = calculatePremixBulk(5, DEFAULTS.premix);
  assert.equal(bulk5kg.salG, 4250);
  assert.equal(bulk5kg.curaG, 200);
  assert.equal(bulk5kg.azucarG, 550);
  console.log('✓ Prueba Laboratorio de Premix aprobada con éxito.');
}

// 5. Verificación de Costeo Financiero
{
  const batch = calculateActiveBatch(30, 'cagada', DEFAULTS.premix, DEFAULTS.precios);
  assert.ok(batch.costs.carne === 30 * DEFAULTS.precios.carne);
  assert.ok(batch.costs.tripa === (30 * 0.9) * DEFAULTS.precios.tripa_pza);
  assert.ok(batch.metrics.costPerKgFinal < batch.metrics.costPerKgCarne); // Por rendimiento de agua/especias
  console.log('✓ Prueba de Escandallo y Costeo aprobada con éxito.');
}

console.log('Todas las pruebas pasaron satisfactoriamente (100% de precisión).');
