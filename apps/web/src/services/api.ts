const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface CreateTicketDto {
  title: string;
  description: string;
  authorId: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: { "Content-Type": "application/json; charset=utf-8", ...options?.headers },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Ошибка сети" }));
      throw new Error(error.message || "API request failed");
    }
    return response.json();
  }

  createTicket(data: CreateTicketDto): Promise<Ticket> {
    return this.request<Ticket>("/tickets", { method: "POST", body: JSON.stringify(data) });
  }
}

export const api = new ApiService();