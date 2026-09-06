# Digihoito

Digihoito on React- ja ASP.NET Core -sovellus. Projekti käytettävässä tilassa, vaikkakin siinä on vielä paranneltavaa.

**Korostettakoon, että tämä siis on vain leluharrastusprojekti**.

## Kuvia

Asiantuntija ja potilas käyttävät sama sovellusta eri selaimella.

**Potilaan näkymä.** Potilas voi myös sulkea chatin ja sitten avautuvassa näkymässä lisätä uuden *case*n so. chat-viestiketjuaiheen...

<img width="1920" height="879" alt="Digihoito-potilas" src="https://github.com/user-attachments/assets/8c7b25f3-00c1-4251-a38e-bfcecf753dc3" />

**Asiantuntijan näkymä**
<img width="1920" height="874" alt="Digihoito-admin" src="https://github.com/user-attachments/assets/8f88344c-32c5-4624-97b8-a349dc1f90d1" />

Asiantuntijalla näkyy siksi enemmän sivuja, koska hän voi lukea kaikkien potilaiden chat-viestit. Lukkoa painamalla asiantuntija voi lukita viestiketjun, jolloin myöskään hän ei itse voi lisätä siihen enää viestejä.

## Esivaatimukset

Asenna Windows-ymparistoon seuraavat:

- .NET 10 SDK
- Node.js ja npm
- SQL Server LocalDB

Projektissa ei ole Docker-konfiguraatiota, joten tietokantana kaytetaan Windowsin
SQL Server LocalDB:ta.

## Tietokantarelaatiot

```text
Users (1) -------- (N) PatientCases
PatientCases (1) - (N) Messages
Users (1) -------- (N) Messages
```

## Kerrosarkkitehtuuri

```text
+------------------------------+
|        Digihoito.Api         |
|  - Controllers / Endpoints   |
+--------------+---------------+
               |
               v
+------------------------------+
|     Digihoito.Application    |
|  - Commands                  |
|  - Queries                   |
|  - DTOs                      |
+--------------+---------------+
               |
               v
+------------------------------+
|   Digihoito.Infrastructure   |
|  - EF Core                   |
|  - DbContext                 |
|  - QueryHandlers             |
|  - Repositories              |
+--------------+---------------+
               |
               v
+------------------------------+
|      Digihoito.Domain        |
|  - PatientCase (Aggregate)   |
|  - Message (Entity)          |
|  - Domain-logiikka           |
+------------------------------+
```

## Domain-malli (aggregate)

```text
Cases
|
|-- PatientCase (Aggregate Root)
|     |-- Id
|     |-- PatientId
|     |-- IsLocked
|     |-- _messages : List<Message>
|     |
|     |-- AddMessage(...)
|     |-- Lock()
|     `-- Messages (ICollection<Message>)
|
`-- Message (Entity)
      |-- Id
      |-- PatientCaseId
      |-- SenderId
      |-- Content
      |-- CreatedAt
      |-- IsReadByAdmin
      |-- IsReadByPatient
      |
      |-- MarkAsReadByAdmin()
      `-- MarkAsReadByPatient()
```

## Asennus ja ensimmainen kaynnistys

Suorita komennot PowerShellissa projektin juurihakemistossa.

### 1. Asenna riippuvuudet ja paivita tietokanta

Palauta ensin backendin riippuvuudet:

```powershell
dotnet restore Digihoito.slnx
```

Aja EF Core -migraatiot ennen ensimmaista backendin kaynnistysta. Komento
kannattaa ajaa infrastruktuuriprojektin hakemistosta:

```powershell
cd src\Digihoito.Infrastructure
dotnet ef database update --startup-project ..\Digihoito.Api
```

Jos `dotnet ef` -komentoa ei loydy, asenna projektin kayttama versio:

```powershell
dotnet tool install --global dotnet-ef --version 10.0.7
```

Aja tietokantapaivitys uudelleen asennuksen jalkeen:

```powershell
dotnet ef database update --startup-project ..\Digihoito.Api
```

Palaa projektin juureen ennen frontendin asennusta:

### 2. Kaynnista backend

Avaa backendia varten oma PowerShell-terminaali projektin juurihakemistoon ja
suorita:

```powershell
dotnet run --project src\Digihoito.Api\Digihoito.Api.csproj
```

Oletuskäynnistys käyttää HTTP-osoitetta:

- `http://localhost:5199`

Jata tama terminaali kayntiin.

### 3. Asenna ja kaynnista frontend

Avaa toinen PowerShell-terminaali projektin juurihakemistoon. Asenna frontendin
riippuvuudet ja kaynnista Vite-kehityspalvelin:

```powershell
cd frontend
npm install
npm run dev
```

`npm install` asentaa riippuvuudet.

Frontend avautuu oletuksena osoitteessa `http://localhost:5173`. Backendin tulee
olla kaynnissa toisessa terminaalissa. Frontend kayttaa backendia osoitteessa
http://localhost:5199; osoite on talla hetkella maaritelty suoraan useisiin
frontendin tiedostoihin, eika projektissa ole `.env`-asetusta.

Kehitysympariston oletusyllapitaja on:

- Sahkoposti (käyttäjätunnus): `admin@digihoito.local`
- Salasana: `Admin123!`

## Konfiguraatio

Backendin oletusyhteysmerkkijono on `appsettings.json`-tiedostossa:

```text
Server=(localdb)\mssqllocaldb;Database=DigihoitoDb;Trusted_Connection=True;MultipleActiveResultSets=true
```

Paikallista yliajoa varten asetukset voi antaa ymparistomuuttujina:

- `ConnectionStrings__DefaultConnection`
- `Jwt__Key`

## Projektin rakenne

- `frontend/`: React 19 + TypeScript + Vite 7 -frontend
- `src/Digihoito.Api/`: ASP.NET Core Minimal API -rajapinta (.NET 10)
- `src/Digihoito.Application/`: sovelluksen commandit, queryt ja DTO:t
- `src/Digihoito.Infrastructure/`: EF Core, DbContext, query handlerit ja repositoriot
- `src/Digihoito.Domain/`: domain-malli ja domain-logiikka
