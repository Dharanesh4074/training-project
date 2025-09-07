using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class PasswordUpdateDto
    {
        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(256)]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(256)]
        public string NewPassword { get; set; }
    }
}
