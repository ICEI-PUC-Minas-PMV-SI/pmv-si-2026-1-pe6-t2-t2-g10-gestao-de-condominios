using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartSindico.Api.Controllers;
using SmartSindico.Application.DTOs.Apartamentos;
using SmartSindico.Application.DTOs.Usuarios;
using SmartSindico.Application.Results;
using SmartSindico.Domain.Entities;
using SmartSindico.Infrastructure.Data;

namespace SmartSindico.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ApartamentoController(AppDbContext context) : ApiControllerBase
{
    [HttpGet]
    [ProducesResponseType<Apartamento>(StatusCodes.Status200OK)]
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
}