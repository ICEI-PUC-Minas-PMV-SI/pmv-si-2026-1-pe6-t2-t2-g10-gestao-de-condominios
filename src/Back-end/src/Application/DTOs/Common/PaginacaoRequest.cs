namespace SmartSindico.Application.DTOs.Common;

public sealed class PaginacaoRequest
{
    private const int DefaultPage = 1;
    private const int DefaultPageSize = 10;
    private const int MaxPageSize = 50;

    public int Page { get; init; } = DefaultPage;
    public int PageSize { get; init; } = DefaultPageSize;

    public int GetNormalizedPage()
    {
        return Page < 1 ? DefaultPage : Page;
    }

    public int GetNormalizedPageSize()
    {
        if (PageSize < 1)
        {
            return DefaultPageSize;
        }

        return Math.Min(PageSize, MaxPageSize);
    }
}
