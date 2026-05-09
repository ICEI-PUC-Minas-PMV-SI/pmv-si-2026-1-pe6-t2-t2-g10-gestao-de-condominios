using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSindico.Application.DTOs.Apartamentos;
using SmartSindico.Application.Results;
using SmartSindico.Domain.Entities;
using SmartSindico.Infrastructure.Data;

namespace SmartSindico.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ApartamentoController(AppDbContext context) : ApiControllerBase
{
    [HttpGet]
    [ProducesResponseType<List<Apartamento>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetApartamentos()
    {
        var lista = await context.Apartamentos.ToListAsync();
        return FromResult(Result<List<Apartamento>>.Success(lista));
    }

    [HttpPost]
    [ProducesResponseType<Apartamento>(StatusCodes.Status201Created)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> CreateApartamento([FromBody] ApartamentoRequest model)
    {
        if (model == null)
            return FromResult(Result<Apartamento>.Failure("Dados obrigatórios", "400", ErrorType.Validation));

        var novoAp = Apartamento.Criar(model.Numero, model.Bloco, model.Andar, model.Tipo);
        context.Apartamentos.Add(novoAp);
        await context.SaveChangesAsync();
        return FromResult(Result<Apartamento>.Success(novoAp));
    }

    [HttpPut("{id}")]
    [ProducesResponseType<bool>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateApartamento(int id, [FromBody] ApartamentoRequest model)
    {
        var existing = await context.Apartamentos.FirstOrDefaultAsync(a => a.Id == id);
        if (existing == null)
            return FromResult(Result<bool>.Failure("Não encontrado", "404", ErrorType.NotFound));

        existing.Atualizar(model.Numero, model.Bloco, model.Andar, model.Tipo);
        await context.SaveChangesAsync();
        return FromResult(Result<bool>.Success(true));
    }

    [HttpDelete("{id}")]
    [ProducesResponseType<bool>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteApartamento(int id)
    {
        var existing = await context.Apartamentos.FirstOrDefaultAsync(a => a.Id == id);
        if (existing == null)
            return FromResult(Result<bool>.Failure("Apartamento não encontrado", "404", ErrorType.NotFound));

        existing.DefinirStatus(false);
        await context.SaveChangesAsync();
        return FromResult(Result<bool>.Success(true));
    }

    [HttpPatch("{id}/Ativar")]
    [ProducesResponseType<bool>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AtivarApartamento(int id)
    {
        var existing = await context.Apartamentos.FirstOrDefaultAsync(a => a.Id == id);
        if (existing == null)
            return FromResult(Result<bool>.Failure("Não encontrado", "404", ErrorType.NotFound));

        existing.DefinirStatus(true);
        await context.SaveChangesAsync();
        return FromResult(Result<bool>.Success(true));
    }
}