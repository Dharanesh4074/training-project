using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class MasterRoleModel
    {
        [Key]
        public int RoleId { get; set; }
        [Required]
        [StringLength(10, MinimumLength = 3)]
        public string Role { get; set; }
    }
}