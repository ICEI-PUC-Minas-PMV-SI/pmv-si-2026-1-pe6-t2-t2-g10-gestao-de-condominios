# Back-end

## Requisitos

- .NET SDK 10
- PostgreSQL local

## Configuracao local

1. Copie o arquivo `src/Api/appsettings.Local.example.json` para `src/Api/appsettings.Local.json`.
2. Ajuste a `DefaultConnection` com a senha real do seu PostgreSQL.
3. Ajuste a chave JWT se quiser usar outra localmente.

Exemplo:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=666;Database=BancoSindico;Username=Guest;Password=Guest"
  },
  "Jwt": {
    "Key": "SmartSindico-chave-super-secreta-para-desenvolvimento-2026"
  }
}
```

## Criar banco e aplicar migrations

No terminal, na pasta `src/Back-end`:

```powershell
dotnet ef database update --project src\Infrastructure\Infrastructure.csproj --startup-project src\Api\Api.csproj
```

Se quiser validar no PostgreSQL:

```sql
\c SmartSindicoBR
\dt
SELECT * FROM "__EFMigrationsHistory";
```

## Rodar a API

```powershell
dotnet run --project src\Api\Api.csproj --launch-profile http
```

## Usuarios de teste

Se quiser popular o banco com usuarios prontos para login, rode:

```sql
INSERT INTO "Usuario"
("Nome", "Email", "SenhaHash", "CPF", "Telefone", "TipoUsuario", "IdApartamento", "Ativo", "DataCriacao", "DataUltimoLogin")
VALUES
('Morador Teste',  'morador@smartsindico.local',  '100000.TBZXbjBiCjTKnE1lxAl2LQ==.iqnGDtVSQdsg39x/Uuu9h90LBeY/LSpUXh0o3WT3dLU=', '11111111111', '31999990001', 1, 101, true, NOW(), NULL),
('Porteiro Teste', 'porteiro@smartsindico.local', '100000.TBZXbjBiCjTKnE1lxAl2LQ==.iqnGDtVSQdsg39x/Uuu9h90LBeY/LSpUXh0o3WT3dLU=', '22222222222', '31999990002', 2, NULL, true, NOW(), NULL),
('Sindico Teste',  'sindico@smartsindico.local',  '100000.TBZXbjBiCjTKnE1lxAl2LQ==.iqnGDtVSQdsg39x/Uuu9h90LBeY/LSpUXh0o3WT3dLU=', '33333333333', '31999990003', 3, 1, true, NOW(), NULL);
```

Senha dos tres usuarios:

```text
123456
```

## Gerar SenhaHash localmente

Se quiser criar um usuario inicial com outra senha, use o script local abaixo:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\Generate-PasswordHash.ps1 -Password "123456"
```

O script imprime uma `SenhaHash` no mesmo formato usado pela aplicacao. Depois basta usar o valor gerado no `INSERT` do usuario.

Perfis atuais:

- `1 = Morador`
- `2 = Funcionario`
- `3 = Sindico`

## Regras atuais de acesso

- `Sindico`: lista todos os usuarios, consulta qualquer usuario, cadastra qualquer perfil, cria e desativa comunicados, e pode alterar o proprio status e o status de `Funcionario`.
- `Funcionario`: consulta o proprio cadastro e cadastros de `Morador`, cadastra apenas `Morador`, cria e desativa comunicados, e pode alterar o status de `Morador`.
- `Morador`: consulta comunicados e pode visualizar apenas o proprio cadastro.

## Padrão de contribuição

Para manter consistência no repositório, o padrão de nomenclatura de branches será:

- `story-YYYYMMDD-PrimeiroNome`
- `bug-YYYYMMDD-PrimeiroNome`

Exemplos:

- `story-20260325-Fellipe`
- `bug-20260325-Fellipe`
