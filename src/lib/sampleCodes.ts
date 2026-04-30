import { SupportedLanguage } from "@/types/reviews";

interface SampleCode {
  label: string;
  language: SupportedLanguage;
  code: string;
}

export const SAMPLE_CODES: SampleCode[] = [
  {
    label: "React Hook (Bug)",
    language: "typescript",
    code: `import { useState, useEffect } from 'react';

function useUserData(userId: string) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, []);

  return { user, loading };
}

function UserProfile({ userId }) {
  const { user, loading } = useUserData(userId);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <img src={user.avatarUrl} />
    </div>
  );
}`,
  },
  {
    label: "Express API (Security)",
    language: "javascript",
    code: `const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password123',
  database: 'myapp'
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = \`SELECT * FROM users WHERE username = '\${username}' AND password = '\${password}'\`;
  
  db.query(query, (err, results) => {
    if (results.length > 0) {
      res.json({ token: username + '_' + Date.now(), user: results[0] });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });
});

app.get('/users/:id', (req, res) => {
  db.query(\`SELECT * FROM users WHERE id = \${req.params.id}\`, (err, results) => {
    res.json(results[0]);
  });
});

app.listen(3000);`,
  },
  {
    label: "Python Data Processing",
    language: "python",
    code: `import json

def process_users(filename):
    file = open(filename, 'r')
    data = json.loads(file.read())
    file.close()
    
    result = []
    for i in range(len(data)):
        user = data[i]
        if user['age'] >= 18:
            name = user['first_name'] + ' ' + user['last_name']
            result.append({
                'name': name,
                'email': user['email'],
                'age': user['age'],
                'is_premium': True if user['subscription'] == 'premium' else False
            })
    
    result.sort(key=lambda x: x['age'])
    
    output = open('output.json', 'w')
    output.write(json.dumps(result))
    output.close()
    
    return result

def find_user(users, name):
    for user in users:
        if user['name'] == name:
            return user
    return None

users = process_users('users.json')
print(f"Processed {len(users)} users")`,
  },
];
