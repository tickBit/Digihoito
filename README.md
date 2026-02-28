# Projekti on tekeillä

Vielä kovin keskeneräinen projekti / still unfinished project

## Tietokantarelaatiot

Users (1) ─────── (N) PatientCases
PatientCases (1) ─────── (N) Messages
Users (1) ─────── (N) Messages

## Kerrosarkkitehtuuri

┌──────────────────────────────┐
│        Digihoito.Api         │
│  - Controllers / Endpoints   │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│     Digihoito.Application    │
│  - Commands                  │
│  - Queries                   │
│  - DTO:t                     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│   Digihoito.Infrastructure   │
│  - EF Core                   │
│  - DbContext                 │
│  - QueryHandlerit            │
│  - Repositoryt               │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│      Digihoito.Domain        │
│  - PatientCase (Aggregate)   │
│  - Message (Entity)          │
│  - Domain-logiikka           │
└──────────────────────────────┘

## Domain-malli (aggregate)

Cases
│
├── PatientCase  (Aggregate Root)
│     ├── Id
│     ├── PatientId
│     ├── IsLocked
│     ├── _messages : List<Message>
│     │
│     ├── AddMessage(...)
│     ├── Lock()
│     └── Messages (IReadOnlyCollection<Message>)
│
└── Message  (Entity)
      ├── Id
      ├── PatientCaseId
      ├── SenderId
      ├── Content
      ├── CreatedAt
      ├── IsReadByAdmin
      ├── IsReadByPatient
      │
      ├── MarkAsReadByAdmin()
      └── MarkAsReadByPatient()
