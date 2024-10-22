db.createUser({
    user: 'admin',
    pwd: 'UTBY6PLastlastminute_!disday5edncan',
    roles: [
      { role: 'dbAdmin', db: 'admin' },
      { role: 'dbOwner', db: 'lastminute' },
    ],
  });

