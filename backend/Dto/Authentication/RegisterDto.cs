using System.ComponentModel.DataAnnotations;

namespace backend.dto
{
    public class registerDto
    {
        [Required]
        [StringLength(50, MinimumLength = 11)]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [StringLength(256)]
        public string Password { get; set; }
        [Required]
        [StringLength(10, MinimumLength = 10, ErrorMessage = "Phone number must be exactly 10 digits")]
        public string Phono { get; set; }
    }
}