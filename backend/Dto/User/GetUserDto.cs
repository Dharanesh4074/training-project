namespace backend.dto
{
    public class GetUserDto
    {
        public int UserId { get; set; }
        public string Email { get; set; }
        public string Phono { get; set; }
        public int Role { get; set; }
    }
}