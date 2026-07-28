const { execSync } = require('child_process');

const colors = {
  green: '\x1b[32m', red: '\x1b[31m', yellow: '\x1b[33m', cyan: '\x1b[36m', gray: '\x1b[90m', reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(\\\\\);
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
        log(\  ✅ \ запущен\, 'green');
      } else {
        log(\  ⚠️ \ не запущен\, 'yellow');
      }
    });
    return true;
  } catch (error) {
    log('  ❌ Docker не доступен', 'red');
    return false;
  }
}

async function checkWithTimeout(url, options = {}, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function checkApiGateway() {
  log('\n2. Проверка API Gateway...', 'cyan');
  try {
    const response = await checkWithTimeout('http://localhost:3000/tickets', { method: 'GET' }, 5000);
    log(\  ✅ API Gateway отвечает (статус: \)\, 'green');
    return true;
  } catch (error) {
    log(\  ❌ API Gateway НЕ отвечает: \\, 'red');
    return false;
  }
}

async function checkTicketCreation() {
  log('\n3. Проверка создания тикета (Kafka RPC)...', 'cyan');
  try {
    const response = await checkWithTimeout('http://localhost:3000/tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        title: 'Смок-тест тикет',
        description: 'Автоматический тест системы',
        authorId: 'smoke-test-user'
      })
    }, 10000); // 10 секунд на RPC вызов

    if (response.ok) {
      const ticket = await response.json();
      log(\  ✅ Тикет успешно создан! ID: \\, 'green');
      log(\     Статус: \\, 'gray');
      return true;
    } else {
      log(\  ❌ Ошибка создания тикета: статус \\, 'red');
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      log('  ❌ Превышено время ожидания (10с). Возможно, Ticket Service не запущен или Kafka не отвечает.', 'red');
    } else {
      log(\  ❌ Ошибка создания тикета: \\, 'red');
    }
    return false;
  }
}

async function checkFrontend() {
  log('\n4. Проверка Frontend (Next.js)...', 'cyan');
  try {
    const response = await checkWithTimeout('http://localhost:3001', {}, 5000);
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
    log(\\n✅ ВСЕ ПРОВЕРКИ ПРОЙДЕНЫ! (\/\)\, 'green');
    process.exit(0);
  } else {
    log(\\n⚠️ ПРОЙДЕНО \ из \ проверок\, 'yellow');
    process.exit(1);
  }
}

runSmokeTest();