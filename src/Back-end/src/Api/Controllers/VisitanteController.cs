using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSindico.Application.DTOs.Usuarios;
using SmartSindico.Application.DTOs.Visitantes;
using SmartSindico.Application.Results;
using SmartSindico.Domain.Entities;
using SmartSindico.Domain.ValueObjects;
using SmartSindico.Infrastructure.Data;

namespace SmartSindico.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VisitantesController(AppDbContext context) : ApiControllerBase
{
    [HttpGet]
    [ProducesResponseType<Visitante>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GeAlltVisitantes()
    {
        var visitantes = await context.Visitantes.Where(v => v.Ativo).ToListAsync();
        return FromResult(Result<List<Visitante>>.Success(visitantes));
    }

    [HttpGet("cpf")]
    [ProducesResponseType<Visitante>(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetVisitantePeloCPF(string cpf)
    {
        var v = await context.Visitantes.FirstOrDefaultAsync(v => v.Cpf.Value == cpf);
        if (v == null) return FromResult(Result<Visitante>.Failure("Visitante não encontrado no sistema.", "404", ErrorType.NotFound));
        return FromResult(Result<Visitante>.Success(v));
    }
    [HttpPost("Cadastro")]
    [ProducesResponseType<Visitante>(StatusCodes.Status201Created)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> CreateVisitante([FromBody] VisitanteRequest model) 
    {
        var cpfObjeto = Cpf.Criar(model.Cpf);
        var existe = await context.Visitantes.AnyAsync(v => v.Cpf.Value == cpfObjeto.Value);
        if (existe) return FromResult(Result<Visitante>.Failure("CPF já cadastrado.", "400", ErrorType.Conflict));

        var novo = Visitante.Criar(model.Nome, cpfObjeto, model.Telefone, model.Observacao, model.IdApartamento);

        context.Visitantes.Add(novo);
        await context.SaveChangesAsync();
        return FromResult(Result<Visitante>.Success(novo));
    }

    [HttpPatch("atualiza-cadastro/{cpf}")]
    [ProducesResponseType<Visitante>(StatusCodes.Status200OK)]
    public async Task<IActionResult> AtualizarVisitantePeloCpf(string cpf, [FromBody] VisitanteRequest model) 
    { 
    
        var existing = await context.Visitantes.FirstOrDefaultAsync(v => v.Cpf.Value == cpf);
        if (existing == null) return FromResult(Result<bool>.Failure("Não encontrado", "404", ErrorType.NotFound));

        existing.Atualizar(model.Nome, model.Telefone, model.Observacao, model.IdApartamento);
        await context.SaveChangesAsync();
        return FromResult(Result<bool>.Success(true));
    }

    [HttpPatch("desativar-visitante/{cpf}")]
    [ProducesResponseType<Visitante>(StatusCodes.Status200OK)]
    public async Task<IActionResult> DasativaVisitantePeloCpf(string cpf)
    {
        var v = await context.Visitantes.FirstOrDefaultAsync(v => v.Cpf.Value == cpf);
        if (v == null) return FromResult(Result<bool>.Failure("Não encontrado", "404", ErrorType.NotFound));
        v.DefinirStatus(false);
        await context.SaveChangesAsync();
        return FromResult(Result<bool>.Success(true));
    }

    [HttpPatch("reativar-visitante/{cpf}")]
    [ProducesResponseType<Visitante>(StatusCodes.Status200OK)]
    public async Task<IActionResult> ReativaVisitantePeloCpf(string cpf)
    {
        var v = await context.Visitantes.FirstOrDefaultAsync(v => v.Cpf.Value == cpf);
        if (v == null) return FromResult(Result<bool>.Failure("Não encontrado", "404", ErrorType.NotFound));
        v.DefinirStatus(true);
        await context.SaveChangesAsync();
        return FromResult(Result<bool>.Success(true));
    }
}