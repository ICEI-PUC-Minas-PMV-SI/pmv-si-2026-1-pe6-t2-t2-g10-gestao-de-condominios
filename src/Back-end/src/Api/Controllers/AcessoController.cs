using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSindico.Application.Results;
using SmartSindico.Domain.Entities;
using SmartSindico.Domain.ValueObjects;
using SmartSindico.Infrastructure.Data;

namespace SmartSindico.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AcessosController(AppDbContext context) : ApiControllerBase
{
    [HttpPost("Entrada/{cpf}")]
    [ProducesResponseType<AcessoVisitante>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegistrarEntrada(string cpf)
    {
        var v = await context.Visitantes.FirstOrDefaultAsync(v => v.Cpf.Value == cpf);
        if (v == null || !v.Ativo)
            return FromResult(Result<AcessoVisitante>.Failure("Visitante inexistente ou inativo", "404", ErrorType.NotFound));

        var aberto = await context.AcessoVisitantes.AnyAsync(a => a.IdVisitante == v.Id && a.DataHoraSaida == null);
        if (aberto)
            return FromResult(Result<AcessoVisitante>.Failure("Já existe um acesso em aberto", "400", ErrorType.Validation));

        var acesso = AcessoVisitante.RegistrarEntrada(v.Id, v.IdApartamento, 0, 1, 1, 1, "Entrada manual");
        context.AcessoVisitantes.Add(acesso);
        await context.SaveChangesAsync();

        return FromResult(Result<AcessoVisitante>.Success(acesso));
    }

    [HttpPost("Saida/{cpf}")]
    [ProducesResponseType<bool>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> RegistrarSaida(string cpf)
    {

        var visitante = await context.Visitantes
         .FirstOrDefaultAsync(v => v.Cpf.Value == cpf);

        if (visitante == null)
            return FromResult(Result<bool>.Failure("Visitante não encontrado.", "404", ErrorType.NotFound));

        var acesso = await context.AcessoVisitantes
            .FirstOrDefaultAsync(a => a.IdVisitante == visitante.Id && a.DataHoraSaida == null);

        if (acesso == null)
            return FromResult(Result<bool>.Failure("Não há acesso aberto para esse visitante.", "404", ErrorType.NotFound));

        acesso.RegistrarSaida();
        await context.SaveChangesAsync();
        return FromResult(Result<bool>.Success(true));
    }

    [HttpGet("buscar-acessos-cpf/{cpf}")]
    [ProducesResponseType<List<AcessoVisitante>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAcessosPorCPF(string cpf)
    {
        var visitante = await context.Visitantes
        .FirstOrDefaultAsync(v => v.Cpf.Value == cpf.Trim());

        if (visitante == null)
            return FromResult(Result<List<AcessoVisitante>>.Success(new List<AcessoVisitante>()));

        var acessos = await context.AcessoVisitantes
            .Where(a => a.IdVisitante == visitante.Id)
            .OrderByDescending(a => a.DataHoraEntrada)
            .ToListAsync();

        return FromResult(Result<List<AcessoVisitante>>.Success(acessos));
    }

    [HttpGet("buscar-acessos-abertos")]
    [ProducesResponseType<List<AcessoVisitante>>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAcessosEmAberto()
    {
        var abertos = await context.AcessoVisitantes
            .Include(a => a.Visitante)
            .Where(a => a.DataHoraSaida == null)
            .ToListAsync();

        return FromResult(Result<List<AcessoVisitante>>.Success(abertos));
    }

}



//cpf teste: 56216959093 
//teste 2 50081837020