using System.ComponentModel.DataAnnotations;

namespace backend.dto
{
    public class BusPassengerDto
{
    public string Name { get; set; } = null!;
    public int Age { get; set; }
    public string Gender { get; set; } = null!;
    public string Email { get; set; } = null!;
}
}