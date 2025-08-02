-- Insert Sample Data for Douba Backend
-- This script inserts users with the specified password hash and creates sample files for each user

USE douba_db;

-- Insert sample users with the provided password hash
-- Password hash: $2b$10$evcxQ1ahy0exbGNPiEOXy.FfkbQJSOx3Na3vPiAAMEpq14.TYMd1G
INSERT INTO users (username, password, role, created_at) VALUES
('alice_smith', '$2b$10$evcxQ1ahy0exbGNPiEOXy.FfkbQJSOx3Na3vPiAAMEpq14.TYMd1G', 'user', NOW()),
('bob_jones', '$2b$10$evcxQ1ahy0exbGNPiEOXy.FfkbQJSOx3Na3vPiAAMEpq14.TYMd1G', 'user', NOW()),
('carol_wilson', '$2b$10$evcxQ1ahy0exbGNPiEOXy.FfkbQJSOx3Na3vPiAAMEpq14.TYMd1G', 'admin', NOW()),
('david_brown', '$2b$10$evcxQ1ahy0exbGNPiEOXy.FfkbQJSOx3Na3vPiAAMEpq14.TYMd1G', 'user', NOW()),
('eva_davis', '$2b$10$evcxQ1ahy0exbGNPiEOXy.FfkbQJSOx3Na3vPiAAMEpq14.TYMd1G', 'user', NOW()),
('frank_miller', '$2b$10$evcxQ1ahy0exbGNPiEOXy.FfkbQJSOx3Na3vPiAAMEpq14.TYMd1G', 'admin', NOW()),
('grace_taylor', '$2b$10$evcxQ1ahy0exbGNPiEOXy.FfkbQJSOx3Na3vPiAAMEpq14.TYMd1G', 'user', NOW()),
('henry_anderson', '$2b$10$evcxQ1ahy0exbGNPiEOXy.FfkbQJSOx3Na3vPiAAMEpq14.TYMd1G', 'user', NOW());

-- Insert sample files for each user
-- Files for alice_smith (user_id: 1)
INSERT INTO files (filename, cid1, cid2, cid3, owner_id, is_private, created_at) VALUES
('document1.pdf', 'QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o', 'QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ', 'QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB', 1, false, NOW()),
('image1.jpg', 'QmSKboVigcD3AY4kLsob117KJcMHvMUu6vNFqk1PQzYUpp', 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG', 'QmZGH5LEXdpufNLLCLjksBaydSdjGB5LvGysGsysEWcCA5', 1, true, NOW()),
('presentation.pptx', 'QmNrEidQrAbxx3FzxNt1QbNp2MFrgThvh8yPEoJbNThvh8', 'QmU5k4W8Rc9wsMwLMBb23VBdh8LwFx3HtS5YdJa7Mf6yQ9', 'QmTYXzeh4zbTLRp7D8W8ZjHcF3u7GRZk4KGPQs6HjJwq4a', 1, false, NOW());

-- Files for bob_jones (user_id: 2)
INSERT INTO files (filename, cid1, cid2, cid3, owner_id, is_private, created_at) VALUES
('report.docx', 'QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ', 'QmVKpLMnop5BgsdTGRxj7w2qN8B7FgE3rD9xFWmJCHgF7j', 'QmSWKBzpMdFnGxCXq8Y7vL2Nc6RJpAbZ5QgF8TkRvNq4sL', 2, false, NOW()),
('video_tutorial.mp4', 'QmZtJVm6vp4BNgQ8rK2LdPmFxYtSz7Cw5VgAJkGp9DhQ2w', 'QmRdWL8JgPvTx9CkFpLm6Z5YgFqX3BwNj4UtQvE7r2SaB8', 'QmKhCp9Lqm5RgT2Y6BwVjNzF8kDaJQp7sGfLnXoM4ZcW3e', 2, true, NOW()),
('spreadsheet.xlsx', 'QmYgTpKm4Vj5DwNsF7qL9BcR8ZaXhCr6pGdJfQ3nE2kW1v', 'QmNbLp3JgKr7FzY8TwVqB5XmPkA4sGdCf9EvR2hQ6nZoUx', 'QmHxFp2Lk9YwRvBnT6ZsD4CgJqA8mGfE3kVpQ7jWrXoS1z', 2, false, NOW());

-- Files for carol_wilson (user_id: 3)
INSERT INTO files (filename, cid1, cid2, cid3, owner_id, is_private, created_at) VALUES
('admin_config.json', 'QmPdGfvuR7VZQ4TTNuHdEEGgG4zR4NgHyEKBpNNNHXb1C2', 'QmTYz4Qm5Px7RwBsJ3Zg8KcF2VdL6pGvNh9YtXkW4mE5fR', 'QmBvKsR2Qy8TcFpG6NbH4XwL7jEaDf5ZkJqPxVgW9mY3sK', 3, true, NOW()),
('system_log.txt', 'QmFgKpT2X8Qm5VcJ4RwLz7Y9BfGaP6sNhWkD3rEvZ1mY8q', 'QmJwBp5Lk9XsF2YgT4RcV7ZnH6aDfGvK3qJpE8mW9rQ1zY', 'QmRsLp6Nk2YcG8TfV9BwJ4XqH7aFdKpR5zGvE3mQ1wY6sB', 3, false, NOW()),
('backup_data.zip', 'QmLpR3Bw6FsJ9TcK2YvG5XnH8aZdFqP4rEvW7mQ1zYkS6B', 'QmKnH4Qs8VcL2RfG6YwB9TzX7aJdPpE5kWvR3mQ8yFsL1z', 'QmGsB5Lp2YcH9TfK6RwV4XnJ7aZdFqE8kPvW3mQ1yRsB6L', 3, true, NOW());

-- Files for david_brown (user_id: 4)
INSERT INTO files (filename, cid1, cid2, cid3, owner_id, is_private, created_at) VALUES
('personal_notes.txt', 'QmVsF9Bp3Lk2YcH6TfR8XwJ5aZdPqG7kEvW4mQ1yRsB9L', 'QmRwG6Bs2Lp5YcF9TkH3XnJ8aZdPvE7kQwR4mQ2yBsG6L', 'QmBkH7Fs3Qp6YcG2TwL9XnJ5aZdEvR8kPsW7mQ3yFkH2B', 4, true, NOW()),
('photo_album.zip', 'QmFpL8Hs4Qk7YcB3TwG6XnJ9aZdRvE5kFsW2mQ8yHpL4B', 'QmHkB9Fs5Qp2YcG7TwL3XnJ6aZdEvR4kHsW8mQ9yBkF5H', 'QmBsL5Hp8Qk3YcF2TwG9XnJ7aZdRvE6kBsW4mQ5yLpH8B', 4, false, NOW());

-- Files for eva_davis (user_id: 5)
INSERT INTO files (filename, cid1, cid2, cid3, owner_id, is_private, created_at) VALUES
('research_paper.pdf', 'QmQp3LsH6Bk9YcF5TwG2XnJ8aZdRvE7kQsW3mQ6yLpH9B', 'QmLsB6Hp4Qk2YcG8TwF5XnJ9aZdEvR3kLsW6mQ7yBpH4L', 'QmHpL9Bs3Qk6YcF8TwG5XnJ2aZdRvE4kHpW9mQ3yLsB6H', 5, false, NOW()),
('code_samples.tar.gz', 'QmBpH4Ls9Qk3YcG6TwF8XnJ5aZdRvE2kBpW4mQ9yLsH6B', 'QmLsH6Bp2Qk9YcG3TwF6XnJ8aZdEvR5kLsW2mQ6yBpH9L', 'QmHpB9Ls5Qk6YcG2TwF9XnJ3aZdRvE8kHpW5mQ2yLsB9H', 5, true, NOW()),
('portfolio.html', 'QmGsH2Bp8Qk5YcL6TwF3XnJ9aZdRvE4kGsW8mQ5yBpH2G', 'QmBpL5Hs2Qk8YcG9TwF6XnJ3aZdEvR7kBpW2mQ8yHsL5B', 'QmHsB8Lp5Qk2YcG3TwF9XnJ6aZdRvE5kHsW8mQ2yBpL8H', 5, false, NOW());

-- Files for frank_miller (user_id: 6)
INSERT INTO files (filename, cid1, cid2, cid3, owner_id, is_private, created_at) VALUES
('server_config.yml', 'QmLpH5Bs8Qk2YcG6TwF9XnJ3aZdRvE7kLpW5mQ8yBsH2L', 'QmBsL8Hp2Qk5YcG3TwF6XnJ9aZdEvR4kBsW8mQ5yLpH8B', 'QmHpB2Ls5Qk8YcG9TwF3XnJ6aZdRvE2kHpW8mQ5yLsB2H', 6, true, NOW()),
('database_dump.sql', 'QmGsB5Lp8Qk2YcH6TwF9XnJ3aZdRvE4kGsW5mQ8yBpL2G', 'QmBpG8Ls2Qk5YcH3TwF6XnJ9aZdEvR7kBpW2mQ8yGsL5B', 'QmLsG2Bp5Qk8YcH9TwF3XnJ6aZdRvE5kLsW8mQ2yGpB8L', 6, false, NOW());

-- Files for grace_taylor (user_id: 7)
INSERT INTO files (filename, cid1, cid2, cid3, owner_id, is_private, created_at) VALUES
('music_collection.mp3', 'QmBpG5Ls8Qk2YcH3TwF6XnJ9aZdRvE7kBpW5mQ8yGsL2B', 'QmGsL2Bp8Qk5YcH6TwF3XnJ9aZdEvR4kGsW2mQ8yBpG5L', 'QmLsB8Gp2Qk5YcH9TwF6XnJ3aZdRvE8kLsW5mQ2yBpG8L', 7, true, NOW()),
('vacation_photos.zip', 'QmGpL5Bs2Qk8YcH6TwF9XnJ3aZdRvE4kGpW5mQ8yBsG2L', 'QmBsG8Lp5Qk2YcH3TwF6XnJ9aZdEvR7kBsW8mQ5yGpL8B', 'QmLpB2Gs8Qk5YcH9TwF3XnJ6aZdRvE2kLpW8mQ5yBsG2L', 7, false, NOW()),
('recipe_book.pdf', 'QmBsG2Lp5Qk8YcH6TwF9XnJ3aZdRvE4kBsW2mQ5yGpL8B', 'QmGpB8Ls5Qk2YcH3TwF6XnJ9aZdEvR7kGpW8mQ2yLsB5G', 'QmLsG5Bp2Qk8YcH9TwF6XnJ3aZdRvE8kLsW5mQ2yGpB8L', 7, false, NOW());

-- Files for henry_anderson (user_id: 8)
INSERT INTO files (filename, cid1, cid2, cid3, owner_id, is_private, created_at) VALUES
('project_proposal.docx', 'QmGpB2Ls5Qk8YcH9TwF6XnJ3aZdRvE7kGpW2mQ5yLsB8G', 'QmLsG8Bp5Qk2YcH3TwF6XnJ9aZdEvR4kLsW8mQ2yGpB5L', 'QmBpL5Gs2Qk8YcH6TwF9XnJ3aZdRvE5kBpW5mQ8yLsG2B', 8, false, NOW()),
('financial_report.xlsx', 'QmLsB8Gp2Qk5YcH9TwF6XnJ3aZdRvE4kLsW8mQ2yBpG5L', 'QmGpL2Bs8Qk5YcH6TwF9XnJ3aZdEvR7kGpW2mQ8yLsB8G', 'QmBsG5Lp8Qk2YcH3TwF6XnJ9aZdRvE8kBsW5mQ8yGpL2B', 8, true, NOW()),
('training_materials.zip', 'QmGpL8Bs2Qk5YcH9TwF6XnJ3aZdRvE4kGpW8mQ2yBsL5G', 'QmBsL5Gp8Qk2YcH6TwF9XnJ3aZdEvR7kBsW5mQ8yLpG8B', 'QmLpG2Bs5Qk8YcH9TwF6XnJ3aZdRvE5kLpW2mQ5yGsB8L', 8, false, NOW());

-- Display success message
SELECT 'Sample users and files inserted successfully!' AS message;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_files FROM files; 