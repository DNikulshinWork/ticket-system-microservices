const { execSync } = require('child_process');

const colors = {
  green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m', cyan: '\x1b[36m', gray: '\x1b[90m', reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function checkDocker() {
  log('\n1. Проверка Docker контейнеров...', 'cyan');
  try {
    const output = execSync('docker ps --format "{{.Names}}"', { encoding: 'utf8' });
    const containers = output.split('\n').filter(Boolean);
    
    const checks = [
      { name: 'PostgreSQL', pattern: /postgres/i },
      { name: 'Redpanda (Kafka)', pattern: /redpanda/i },
      { name: 'Redis', pattern: /redis/i }
    ];
    
    checks.forEach(check => {
      if (containers.some(c => check.pattern.test(c))) {
        log(`  ✅ ${check.name} запущен`, 'green');
      } else {
        log(`  ⚠️ ${check.name} не запущен`, 'yellow');
      }
    });
    return true;
  } catch (error) {
    log('  ❌ Docker не доступен', 'red');
    return false;
  }
}

async function checkApiGateway() {
  log('\n2. Проверка API Gateway...', 'cyan');
  try {
    // Проверяем любой эндпоинт. Даже 404 означает, что сервер жив и слушает порт!
    const response = await fetch('http://localhost:3000/tickets', { method: 'GET' });
    log(`  ✅ API Gateway отвечает (статус: ${response.status})`, 'green');
    return true;
  } catch (error) {
    log(`  ❌ API Gateway НЕ отвечает: ${error.message}`, 'red');
    return false;
  }
}

async function checkTicketCreation() {
  log('\n3. Проверка создания тикета (Kafka RPC)...', 'cyan');
  try {
    const response = await fetch('http://localhost:3000/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        title: 'Смок-тест тикет',
        description: 'Автоматический тест системы',
        authorId: 'smoke-test-user'
      })
    });
    
    if (response.ok) {
      const ticket = await response.json();
      log(`  ✅ Тикет успешно создан! ID: ${ticket.id}`, 'green');
      log(`     Статус: ${ticket.status}`, 'gray');
      return true;
    }
  } catch (error) {
    log(`  ❌ Ошибка создания тикета: ${error.message}`, 'red');
  }
  return false;
}

async function checkFrontend() {
  log('\n4. Проверка Frontend (Next.js)...', 'cyan');
  try {
    const response = await fetch('http://localhost:3001');
    if (response.ok) {
      log('  ✅ Frontend отвечает на http://localhost:3001', 'green');
      return true;
    }
  } catch (error) {
    log('  ⚠️ Frontend НЕ отвечает', 'yellow');
  }
  return false;
}

async function runSmokeTest() {
  log('\n🔍 НАЧИНАЕМ СМОК-ТЕСТ СИСТЕМЫ', 'cyan');
  log('================================', 'cyan');
  
  const results = {
    docker: await checkDocker(),
    apiGateway: await checkApiGateway(),
    ticketCreation: await checkTicketCreation(),
    frontend: await checkFrontend()
  };
  
  log('\n================================', 'cyan');
  log('🎯 РЕЗУЛЬТАТЫ СМОК-ТЕСТА', 'cyan');
  log('================================', 'cyan');
  
  const passed = Object.values(results).filter(Boolean).length;
  const total = Object.keys(results).length;
  
  if (passed === total) {
    log(`\n✅ ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ! (${passed}/${total})`, 'green');
    process.exit(0);
  } else {
    log(`\n⚠️ ПРОЙДЕНО ${passed} из ${total} проверок`, 'yellow');
    process.exit(1);
  }
}

runSmokeTest();