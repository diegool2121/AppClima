import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import Home from "./index"; 

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Página principal - aplicación clima", () => {
  test("muestra la info del clima tras una búsqueda exitosa", async () => {
    const mockResponse = {
      data: {
        name: "Quito",
        main: { temp: 22, humidity: 60 },
        weather: [{ description: "nublado" }],
      },
    };

    mockedAxios.get.mockResolvedValueOnce(mockResponse);

    render(<Home />);

    const input = screen.getByPlaceholderText(/ingresa una ciudad/i);
    const button = screen.getByRole("button", { name: /buscar/i });

    await userEvent.type(input, "Quito");
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/temperatura actual/i)).toBeInTheDocument();
      expect(screen.getByText(/22/i)).toBeInTheDocument();
      expect(screen.getByText(/60/i)).toBeInTheDocument();
      expect(screen.getByText(/nublado/i)).toBeInTheDocument();
    });
  });

  test("maneja error cuando la ciudad es inválida", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Ciudad no encontrada"));

    render(<Home />);

    const input = screen.getByPlaceholderText(/ingresa una ciudad/i);
    const button = screen.getByRole("button", { name: /buscar/i });

    await userEvent.type(input, "CiudadInvalida");
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/ciudad no encontrada o error/i)).toBeInTheDocument();
    });
  });

  test("campo de entrada y botón funcionan correctamente", () => {
    render(<Home />);

    const input = screen.getByPlaceholderText(/ingresa una ciudad/i);
    const button = screen.getByRole("button", { name: /buscar/i });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    userEvent.type(input, "Guayaquil");
    expect((input as HTMLInputElement).value).toBe("Guayaquil");
  });
});
