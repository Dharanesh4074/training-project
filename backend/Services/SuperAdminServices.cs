using System.Net;
using System.Net.Mail;
using System.Security.Cryptography;
using System.Text;
using backend.Context;
using backend.dto;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class SuperAdminServices : ISuperAdminInterface
    {
        private readonly AppDbContext _context;
        public SuperAdminServices(AppDbContext context)
        {
            _context = context;
        }
        private string GetPassword(string _password)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(_password);
                byte[] hashBytes = sha256.ComputeHash(bytes);

                StringBuilder builder = new StringBuilder();
                foreach (var b in hashBytes)
                {
                    builder.Append(b.ToString("x2"));
                }
                return builder.ToString();
            }
        }
        private bool SendWelcomeMail(UserModel user)
        {
            try
            {
                string templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "ticket-welcome.html");

                if (!File.Exists(templatePath))
                {
                    Console.WriteLine("Email template not found.");
                    return false;
                }

                string template = File.ReadAllText(templatePath);
                string body = template
                    .Replace("{Email}", user.Email)
                    .Replace("{Password}", "123456")
                    .Replace("{LoginUrl}", "https://ticketbookingagency.com/login");

                var smtp = new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential("dharaneshr.22bsr@gmail.com", "uoyx kuja pbrz hmak")
                };

                var mail = new MailMessage("dharaneshr.22bsr@gmail.com", user.Email)
                {
                    Subject = "Welcome to Ticket Booking Agency",
                    Body = body,
                    IsBodyHtml = true
                };

                smtp.Send(mail);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send welcome email: {ex.Message}");
                return false;
            }
        }
        private bool SendRejectionMail(UserModel user)
        {
            try
            {
                string templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "ticket-rejection.html");

                if (!File.Exists(templatePath))
                {
                    Console.WriteLine("Email template not found.");
                    return false;
                }

                string template = File.ReadAllText(templatePath);
                string body = template
                    .Replace("{Email}", user.Email)
                    .Replace("{RejectionReason}", "Please Contact the Admin Offcie : riseyourjourney@gmail.com")
                    .Replace("{LoginUrl}", "https://ticketbookingagency.com/login");

                var smtp = new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential("dharaneshr.22bsr@gmail.com", "uoyx kuja pbrz hmak")
                };

                var mail = new MailMessage("dharaneshr.22bsr@gmail.com", user.Email)
                {
                    Subject = "Your Provider Application Status - Rejected",
                    Body = body,
                    IsBodyHtml = true
                };

                smtp.Send(mail);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send rejection email: {ex.Message}");
                return false;
            }
        }


        public IActionResult updateProviderStatus(UpdateProviderStatus _updateProviderDetails)
        {
            try
            {
                var provider = _context.providerModel.FirstOrDefault(p => p.ProviderId == _updateProviderDetails.ProviderId);
                if (provider == null)
                {
                    return new NotFoundObjectResult(new { message = "Provider not found." });
                }

                provider.ApprovelStatus = _updateProviderDetails.ApprovelStatus;

                if (_updateProviderDetails.ApprovelStatus.ToLower() == "accepted")
                {
                    var existingUser = _context.usersModel.FirstOrDefault(u => u.Email == provider.ProviderEmail);
                    if (existingUser == null)
                    {
                        var newUser = new UserModel
                        {
                            Email = provider.ProviderEmail,
                            Password = GetPassword("123456"),
                            Phono = "0000000000",
                            Role = 3,
                        };

                        bool mailSent = SendWelcomeMail(newUser);
                        if (mailSent)
                        {
                            _context.usersModel.Add(newUser);
                            _context.SaveChanges();
                        }
                        else
                        {
                            return new ObjectResult(new { message = "Failed to send welcome email." }) { StatusCode = 500 };
                        }
                    }
                }
                else if (_updateProviderDetails.ApprovelStatus.ToLower() == "rejected")
                {


                    // Send rejection email
                    bool mailSent = SendRejectionMail(new UserModel { Email = provider.ProviderEmail });
                    if (!mailSent)
                    {
                        return new ObjectResult(new { message = "Failed to send rejection email." }) { StatusCode = 500 };
                    }
                }

                _context.SaveChanges();
                return new OkObjectResult(new { message = "Provider status updated successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating provider status: {ex.Message}");

                return new ObjectResult(new { message = "Internal server error", error = ex.Message })
                {
                    StatusCode = 500
                };
            }
        }

        public IActionResult addRole(MasterRoleDto _masterRole)
        {
            try
            {
                var existing_role = _context.masterRoleModel.FirstOrDefault(x => x.Role == _masterRole.Role);
                if (existing_role != null)
                {
                    return new OkObjectResult(new { message = "Id is already taken." });
                }
                var role = new MasterRoleModel
                {
                    Role = _masterRole.Role
                };
                _context.masterRoleModel.Add(role);
                _context.SaveChanges();
                return new OkObjectResult(new { message = "Role Added Successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during Adding Role: {ex.Message}");

                return new ObjectResult(new { message = "Internal server error", error = ex.Message })
                {
                    StatusCode = 500
                };
            }
        }

        public IEnumerable<ProviderModel> getAllProvider()
        {
            var providers = _context.providerModel.ToList();
            return providers;
        }


        public IActionResult deleteProvider(DeleteProvider _deleteProvider)
        {
            try
            {
                var provider = _context.providerModel.FirstOrDefault(p => p.ProviderId == _deleteProvider.ProviderId);
                if (provider == null)
                {
                    return new NotFoundObjectResult(new { message = "Provider not found." });
                }

                _context.providerModel.Remove(provider);
                _context.SaveChanges();

                return new OkObjectResult(new { message = "Provider deleted successfully." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting provider: {ex.Message}");

                return new ObjectResult(new { message = "Internal server error", error = ex.Message })
                {
                    StatusCode = 500
                };
            }
        }
        public IEnumerable<FlightModel> GetFlightsByProvider()
        {
            return _context.flightModel
                .Include(b => b.Provider)
                .ToList();
        }
        public IEnumerable<BusModel> GetBusesByProvider()
        {
            return _context.busModel
                .Include(b => b.Provider)
                .ToList();
        }
        public IEnumerable<TrainModel> GetTrainsByProvider()
        {
            return _context.trainModel
                .Include(b => b.Provider)
                .ToList();
        }
        public IEnumerable<GetUserDto> GetAllUsers()
        {
            return _context.usersModel
                .Where(u => u.Role == 4)
                .Select(u => new GetUserDto
                {
                    UserId = u.UserId,
                    Email = u.Email,
                    Phono = u.Phono,
                    Role = u.Role
                })
                .ToList();
        }
        public IEnumerable<FlightModel> GetFlightsByAdmin()
        {
            return _context.flightModel
                .Include(b => b.Provider)
                .ToList();
        }
        public IEnumerable<BusModel> GetBusesByAdmin()
        {
            return _context.busModel
                .Include(b => b.Provider)
                .ToList();
        }
        public IEnumerable<TrainModel> GetTrainsByAdmin()
        {
            return _context.trainModel
                .Include(b => b.Provider)
                .ToList();
        }
    }
}