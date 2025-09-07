using System.ComponentModel.DataAnnotations;

namespace backend.dto
{
    public class MasterRoleDto
    {
        [Required]
        [StringLength(10, MinimumLength = 3)]
        public string Role { get; set; }
    }
}
