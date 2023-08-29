## _ How to use This Repository _

1. Clone the Repository.

```bash
git clone https://github.com/raj01999/syook-encrypted-timeseries.git
```

2. Move to working directory.

```bash
cd syook-encrypted-timeseries
```

3. Install all the dependencies
   And Run the start command
   For different services need to run in different terminals.

i. Emitter Service

```bash
cd emitter-service
npm install
npm run start
```

ii. Listener Service

```bash
cd listener-service
npm install
npm run start
```

iii. Frontend

```bash
cd frontend
npm install
npm run start
```

4. All the service will run on there respective port

i. Emitter Service will open at {port: 3001}
http://localhost:3001

ii. Listener Service will open at {port: 3002}
http://localhost:3002

iii. By default react will open at {port: 3000}
http://localhost:3000
