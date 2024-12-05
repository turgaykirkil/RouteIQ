const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// DB'yi oku
const dbPath = path.join(__dirname, 'db.json');
const readDatabase = () => {
  try {
    const rawData = fs.readFileSync(dbPath);
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Database read error:', error);
    return { users: [] };
  }
};

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });

  const db = readDatabase();
  const user = db.users.find(u => 
    u.email === email && 
    u.password === password
  );

  if (user) {
    console.log('User authenticated:', user);
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } else {
    console.log('Authentication failed');
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Diğer endpoint'ler için json-server benzeri basit router
const createRouter = (resource) => {
  return {
    get: (id, filters = {}) => {
      try {
        console.log('EVRAKA - createRouter: Gelen filtreler', { resource, id, filters });
        
        const db = readDatabase();
        let items = id ? [db[resource].find(item => item.id === id)] : db[resource];
        
        // Filtreleme mantığı
        if (!id && Object.keys(filters).length > 0) {
          items = items.filter(item => {
            return Object.entries(filters).every(([key, value]) => {
              // Rol bazlı filtreleme için özel kontrol
              if (key === 'salesRepId' && resource === 'customers') {
                // salesRepId'yi string'e çevir
                const itemSalesRepId = item.salesRepId ? item.salesRepId.toString() : null;
                const filterSalesRepId = value ? value.toString() : null;
                
                console.log(`EVRAKA - Müşteri filtreleme: 
                  item.salesRepId (${itemSalesRepId}) === value (${filterSalesRepId})`);
                
                return itemSalesRepId === filterSalesRepId;
              }
              if (key === 'userId' && resource === 'tasks') {
                // userId'yi string'e çevir
                const itemUserId = item.userId ? item.userId.toString() : null;
                const filterUserId = value ? value.toString() : null;
                
                console.log(`EVRAKA - Görev filtreleme: 
                  item.userId (${itemUserId}) === value (${filterUserId})`);
                
                return itemUserId === filterUserId;
              }
              // Diğer filtreler için genel kontrol
              if (typeof item[key] === 'string' && typeof value === 'string') {
                return item[key].toLowerCase() === value.toLowerCase();
              } else {
                return item[key] === value;
              }
            });
          });
        }
        
        console.log('EVRAKA - Dönen items:', items.length);
        
        // id ile çağrılırsa ve bulunamazsa null döndür
        return id ? (items[0] || null) : items;
      } catch (error) {
        console.error('EVRAKA - createRouter Error:', {
          resource,
          id,
          filters,
          errorMessage: error.message,
          errorStack: error.stack
        });
        throw error;
      }
    },
    post: (data) => {
      try {
        const db = readDatabase();
        const newItem = { ...data, id: Date.now().toString() };
        db[resource].push(newItem);
        fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
        return newItem;
      } catch (error) {
        console.error('EVRAKA - createRouter Post Error:', {
          resource,
          data,
          errorMessage: error.message,
          errorStack: error.stack
        });
        throw error;
      }
    }
  };
};

// Dinamik route'lar
['customers', 'tasks', 'sales'].forEach(resource => {
  app.get(`/api/${resource}`, (req, res) => {
    try {
      const router = createRouter(resource);
      const { role, salesRepId, teamId, userId } = req.query;
      
      console.log('EVRAKA - Route Request:', { 
        resource, 
        role, 
        salesRepId, 
        teamId, 
        userId,
        queryParams: req.query 
      });

      // Eğer salesRepId boş ise ve rol sales_rep ise hata döndür
      if (role === 'sales_rep' && !salesRepId) {
        console.error('EVRAKA - Sales Rep için salesRepId zorunludur');
        return res.status(400).json({ error: 'Sales Rep için salesRepId gereklidir' });
      }

      let items = router.get(null, { role, salesRepId, teamId, userId });

      console.log('EVRAKA - Route Response:', { 
        resource, 
        itemCount: items.length,
        firstItem: items[0]
      });

      res.json(items);
    } catch (error) {
      console.error('EVRAKA - Route Error:', error);
      res.status(500).json({ 
        error: 'Internal Server Error', 
        message: error.message,
        stack: error.stack 
      });
    }
  });

  app.get(`/api/${resource}/:id`, (req, res) => {
    try {
      const router = createRouter(resource);
      const item = router.get(req.params.id);
      item ? res.json(item) : res.status(404).json({ message: 'Not found' });
    } catch (error) {
      console.error('EVRAKA - Route Error:', error);
      res.status(500).json({ 
        error: 'Internal Server Error', 
        message: error.message,
        stack: error.stack 
      });
    }
  });

  app.post(`/api/${resource}`, (req, res) => {
    try {
      const router = createRouter(resource);
      const newItem = router.post(req.body);
      res.status(201).json(newItem);
    } catch (error) {
      console.error('EVRAKA - Route Error:', error);
      res.status(500).json({ 
        error: 'Internal Server Error', 
        message: error.message,
        stack: error.stack 
      });
    }
  });
});

const PORT = 3000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
