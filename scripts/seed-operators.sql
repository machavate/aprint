-- Seed initial operators
INSERT INTO operators (name, email, pin) VALUES
('João Silva', 'joao@papelaria.local', '1234'),
('Maria Santos', 'maria@papelaria.local', '5678'),
('Pedro Costa', 'pedro@papelaria.local', '9012')
ON CONFLICT (email) DO NOTHING;
