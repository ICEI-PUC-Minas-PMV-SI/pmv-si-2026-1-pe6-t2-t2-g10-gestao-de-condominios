using SmartSindico.Application.Interfaces.Persistence;
using SmartSindico.Application.Interfaces.Services;
using SmartSindico.Application.DTOs.Comunicados;
using SmartSindico.Application.Interfaces.Validation;
using SmartSindico.Application.Results;
using SmartSindico.Domain.Entities;

namespace SmartSindico.Application.Services;

public class ComunicadoService : IComunicadoService
{
    private readonly IComunicadoRepository _comunicadoRepository;
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IValidator<CriacaoComunicadoRequest> _criacaoValidator;

    public ComunicadoService(
        IComunicadoRepository comunicadoRepository,
        IUsuarioRepository usuarioRepository,
        IValidator<CriacaoComunicadoRequest> criacaoValidator)
    {
        _comunicadoRepository = comunicadoRepository;
        _usuarioRepository = usuarioRepository;
        _criacaoValidator = criacaoValidator;
    }

    public async Task<Result<IReadOnlyList<ComunicadoResponse>>> ObterAtivosAsync(CancellationToken cancellationToken = default)
    {
        var comunicados = await _comunicadoRepository.ObterAtivosAsync(cancellationToken);
        return Result<IReadOnlyList<ComunicadoResponse>>.Success(comunicados.Select(ParaResposta).ToList());
    }

    public async Task<Result<ComunicadoResponse>> ObterPorIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var comunicado = await _comunicadoRepository.ObterPorIdAsync(id, cancellationToken);
        if (comunicado is null)
        {
            return Result<ComunicadoResponse>.Failure(
                "Comunicado não encontrado.",
                "NOTICE_NOT_FOUND",
                ErrorType.NotFound);
        }

        return Result<ComunicadoResponse>.Success(ParaResposta(comunicado));
    }

    public async Task<Result<ComunicadoResponse>> CriarAsync(int idAutor, CriacaoComunicadoRequest requisicao, CancellationToken cancellationToken = default)
    {
        var validacao = await _criacaoValidator.ValidateAsync(requisicao, cancellationToken);
        if (!validacao.IsValid)
        {
            return Result<ComunicadoResponse>.ValidationFailure(validacao.Errors);
        }

        var autor = await _usuarioRepository.ObterPorIdAsync(idAutor, cancellationToken);
        if (autor is null)
        {
            return Result<ComunicadoResponse>.Failure(
                "Autor do comunicado não encontrado.",
                "AUTHOR_NOT_FOUND",
                ErrorType.NotFound);
        }

        if (!autor.Ativo)
        {
            return Result<ComunicadoResponse>.Failure(
                "Autor inativo.",
                "AUTHOR_INACTIVE",
                ErrorType.Forbidden);
        }

        var comunicado = Comunicado.Criar(
            idAutor,
            requisicao.Titulo,
            requisicao.Conteudo,
            requisicao.Destaque,
            DateTime.UtcNow);

        await _comunicadoRepository.AdicionarAsync(comunicado, cancellationToken);
        comunicado.AssociarAutor(autor);

        return Result<ComunicadoResponse>.Success(ParaResposta(comunicado));
    }

    public async Task<Result<ComunicadoResponse>> AtualizarStatusAsync(int id, AtualizacaoStatusComunicadoRequest requisicao, CancellationToken cancellationToken = default)
    {
        var comunicado = await _comunicadoRepository.ObterPorIdAsync(id, cancellationToken);
        if (comunicado is null)
        {
            return Result<ComunicadoResponse>.Failure(
                "Comunicado não encontrado.",
                "NOTICE_NOT_FOUND",
                ErrorType.NotFound);
        }

        comunicado.DefinirStatus(requisicao.Ativo);
        await _comunicadoRepository.AtualizarAsync(comunicado, cancellationToken);

        return Result<ComunicadoResponse>.Success(ParaResposta(comunicado));
    }

    private static ComunicadoResponse ParaResposta(Comunicado comunicado)
    {
        return new ComunicadoResponse
        {
            Id = comunicado.Id,
            IdAutor = comunicado.IdAutor,
            NomeAutor = comunicado.Autor?.Nome ?? string.Empty,
            Titulo = comunicado.Titulo,
            Conteudo = comunicado.Conteudo,
            DataPublicacao = comunicado.DataPublicacao,
            Ativo = comunicado.Ativo,
            Destaque = comunicado.Destaque
        };
    }
}
