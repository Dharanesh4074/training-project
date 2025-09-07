using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class UserModel
    {
        [Key]
        public int UserId { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 11)]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [StringLength(256)]
        public string Password { get; set; }
        // [Required]
        [StringLength(10, MinimumLength = 10, ErrorMessage = "Phone number must be exactly 10 digits")]
        public string Phono { get; set; }
        [Required]
        public int Role { get; set; } = 4;
    }
}
