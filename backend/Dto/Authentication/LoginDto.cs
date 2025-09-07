using System.ComponentModel.DataAnnotations;

namespace backend.dto
{
    public class loginDto
    {
        [Required]
        [StringLength(50, MinimumLength = 11)]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [StringLength(256)]
        public string Password { get; set; }
    }
}