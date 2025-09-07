using System.ComponentModel.DataAnnotations;

namespace backend.dto
{
    public class ProviderDto
    {
        [Required]
        [StringLength(50, MinimumLength = 5)]
        public string ProviderName { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 11)]
        [EmailAddress]
        public string ProviderEmail { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 7)]
        public string ProviderOrganization { get; set; }
        [Required]
        [StringLength(50, MinimumLength = 2)]
        public string ProviderType { get; set; }
    }

    public class UpdateProviderStatus
    {
        [Required]
        public int ProviderId { get; set; }
        [Required]
        public string ApprovelStatus { get; set; }
    }

    public class DeleteProvider
    {
        [Required]
        public int ProviderId { get; set; }
    }
}